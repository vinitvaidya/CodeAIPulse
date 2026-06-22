"""Business logic for CodeAIPulse — AI calls, file I/O, task operations."""

import json
import uuid
from datetime import datetime, date
from pathlib import Path

import google.generativeai as genai
from dotenv import load_dotenv
import os
import requests
from tavily_fetch import get_tech_news

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
_model = genai.GenerativeModel("gemini-2.5-flash")

TAVILY_ENABLED = os.getenv("TAVILY_ENABLED", "false").lower() == "true"
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")

DATA_DIR = Path(__file__).parent / "data"
TASKS_FILE = DATA_DIR / "tasks.json"
BRIEFING_FILE = DATA_DIR / "briefing.json"


# ── low-level helpers ─────────────────────────────────────────────────────────

def today_str() -> str:
    """Return today's date as an ISO string."""
    return date.today().isoformat()


def _ask_gemini(prompt: str) -> str:
    """Send a prompt to Gemini and return the stripped text response."""
    response = _model.generate_content(prompt)
    return response.text.strip()


def _strip_fences(raw: str) -> str:
    """Remove markdown code fences that Gemini sometimes wraps JSON in."""
    return raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()


def _search_tavily(query: str) -> str | None:
    """Search Tavily for a web result; returns the first result or None if unavailable."""
    if not TAVILY_ENABLED or not TAVILY_API_KEY:
        return None
    try:
        response = requests.post(
            "https://api.tavily.com/search",
            json={"api_key": TAVILY_API_KEY, "query": query, "max_results": 1},
            timeout=5
        )
        response.raise_for_status()
        data = response.json()
        if data.get("results"):
            return data["results"][0].get("content", "")
    except Exception:
        pass
    return None


def _read_tasks() -> list[dict]:
    """Load all tasks from tasks.json."""
    with open(TASKS_FILE) as f:
        return json.load(f)


def _write_tasks(tasks: list[dict]) -> None:
    """Persist tasks list to tasks.json."""
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=2)


# ── briefing ──────────────────────────────────────────────────────────────────

def _read_briefings() -> dict:
    """Load all briefings from briefing.json (keyed by date string)."""
    with open(BRIEFING_FILE) as f:
        return json.load(f)


def _write_briefings(briefings: dict) -> None:
    """Persist all briefings to briefing.json."""
    with open(BRIEFING_FILE, "w") as f:
        json.dump(briefings, f, indent=2)


def get_or_generate_briefing() -> dict:
    """Return today's briefing from cache, or generate and cache a new one."""
    briefings = _read_briefings()
    today = today_str()

    if today in briefings:
        return briefings[today]

    prompt = (
        "You are a helpful productivity coach. Generate a morning briefing in JSON with exactly "
        "these keys: quote (a short motivational quote), focus_tip (one practical focus tip for today), "
        "message (an encouraging message under 50 words). Reply with raw JSON only, no markdown."
    )
    raw = _strip_fences(_ask_gemini(prompt))

    try:
        content = json.loads(raw)
    except json.JSONDecodeError:
        content = {"quote": raw, "focus_tip": "", "message": ""}

    briefing = {**content, "date": today}

    web_tip = _search_tavily(f"productivity tip for developers {today}")
    if web_tip:
        briefing["web_tip"] = web_tip

    briefings[today] = briefing
    _write_briefings(briefings)

    return briefing


# ── tasks ─────────────────────────────────────────────────────────────────────

def list_tasks() -> list[dict]:
    """Return all tasks."""
    return _read_tasks()


def add_task(title: str) -> dict:
    """Create a task and populate subtasks via Gemini (falls back to manual breakdown if AI is unavailable)."""
    try:
        prompt = (
            f"Break this task into 3 to 5 concrete, actionable subtasks: \"{title}\". "
            "Reply with a JSON array of strings only, no markdown, no explanations."
        )
        raw = _strip_fences(_ask_gemini(prompt))
        subtasks: list[str] = json.loads(raw)
        if not isinstance(subtasks, list):
            raise ValueError
    except Exception:
        subtasks = ["Break this task down manually"]

    task = {
        "id": str(uuid.uuid4()),
        "title": title,
        "subtasks": subtasks,
        "completed": False,
        "completed_at": None,
        "created_at": datetime.utcnow().isoformat(),
    }

    tasks = _read_tasks()
    tasks.append(task)
    _write_tasks(tasks)

    return task


def mark_task_complete(task_id: str) -> dict | None:
    """Mark a task complete; returns the updated task or None if not found."""
    tasks = _read_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = True
            task["completed_at"] = datetime.utcnow().isoformat()
            _write_tasks(tasks)
            return task
    return None


def remove_task(task_id: str) -> bool:
    """Delete a task by ID; returns True if found and removed, False otherwise."""
    tasks = _read_tasks()
    filtered = [t for t in tasks if t["id"] != task_id]
    if len(filtered) == len(tasks):
        return False
    _write_tasks(filtered)
    return True


def breakdown_task(task_description: str) -> dict:
    """Generate a detailed task breakdown with time estimates for each subtask."""
    try:
        prompt = (
            f"Break down this task into detailed, actionable subtasks with realistic time estimates: \"{task_description}\". "
            "Reply with a JSON object containing 'subtasks' (array of objects with 'title' and 'estimate_minutes' keys) "
            "and 'total_estimate_minutes' (total time estimate). "
            "Example: {\"subtasks\": [{\"title\": \"Do X\", \"estimate_minutes\": 30}], \"total_estimate_minutes\": 30}. "
            "Reply with raw JSON only, no markdown."
        )
        raw = _strip_fences(_ask_gemini(prompt))
        breakdown: dict = json.loads(raw)
        if not isinstance(breakdown, dict) or "subtasks" not in breakdown:
            raise ValueError
    except Exception:
        breakdown = {
            "subtasks": [{"title": "Break this task down manually", "estimate_minutes": 0}],
            "total_estimate_minutes": 0
        }

    return {
        "task_description": task_description,
        "breakdown": breakdown
    }


def get_ai_news() -> dict:
    """Fetch latest AI and tech news."""
    try:
        news_items = get_tech_news()
        return {
            "news": news_items,
            "count": len(news_items)
        }
    except Exception:
        return {
            "news": [],
            "count": 0,
            "error": "Failed to fetch news"
        }


# ── standup ───────────────────────────────────────────────────────────────────

def generate_standup() -> str:
    """Generate a standup message from today's completed tasks, including subtask detail."""
    tasks = _read_tasks()
    completed_today = [
        t for t in tasks
        if t["completed"] and t.get("completed_at", "")[:10] == today_str()
    ]

    if not completed_today:
        return "No tasks were completed today yet."

    task_lines = []
    for t in completed_today:
        task_lines.append(f"- {t['title']}")
        for sub in t.get("subtasks", []):
            task_lines.append(f"  • {sub}")

    task_list = "\n".join(task_lines)
    prompt = (
        "Write a short, professional standup update (3-4 sentences) based on these completed tasks "
        "and their subtasks:\n"
        f"{task_list}\n\n"
        "Summarise what was accomplished (referencing specific subtasks where relevant), "
        "mention what is likely next, and note any blockers if implied. Plain text only."
    )
    return _ask_gemini(prompt)


# ── insights ──────────────────────────────────────────────────────────────────

def generate_insights() -> str:
    """Generate productivity insights from today's task patterns."""
    tasks = _read_tasks()
    today_tasks = [t for t in tasks if t.get("created_at", "")[:10] == today_str()]

    if not today_tasks:
        return "No tasks recorded today yet."

    completed = [t for t in today_tasks if t["completed"]]
    completion_rate = len(completed) / len(today_tasks) * 100

    task_summary = "\n".join(
        f"- [{'done' if t['completed'] else 'pending'}] {t['title']}"
        for t in today_tasks
    )
    prompt = (
        f"Today's task completion rate: {completion_rate:.0f}%\n"
        f"Tasks:\n{task_summary}\n\n"
        "Analyze these tasks and provide: 1) a productivity insight, "
        "2) one concrete improvement suggestion, 3) a brief encouraging note. "
        "Keep it under 100 words. Plain text."
    )
    return _ask_gemini(prompt)
