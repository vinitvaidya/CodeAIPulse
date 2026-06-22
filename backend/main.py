"""FastAPI entry point for CodeAIPulse — routes only."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import services

app = FastAPI(title="CodeAIPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaskCreate(BaseModel):
    title: str


class TaskBreakdownRequest(BaseModel):
    task_description: str


@app.get("/briefing")
def get_briefing() -> dict:
    """Return today's morning briefing."""
    return services.get_or_generate_briefing()


@app.get("/tasks")
def get_tasks() -> list[dict]:
    """Return all tasks."""
    return services.list_tasks()


@app.post("/tasks", status_code=201)
def create_task(body: TaskCreate) -> dict:
    """Create a task with AI-generated subtasks."""
    return services.add_task(body.title)


@app.post("/tasks/breakdown")
def breakdown_task(body: TaskBreakdownRequest) -> dict:
    """Generate a detailed task breakdown with time estimates."""
    return services.breakdown_task(body.task_description)


@app.put("/tasks/{task_id}/complete")
def complete_task(task_id: str) -> dict:
    """Mark a task as complete."""
    task = services.mark_task_complete(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: str) -> None:
    """Delete a task by ID."""
    if not services.remove_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found")


@app.get("/standup")
def get_standup() -> dict:
    """Generate a standup from today's completed tasks."""
    return {"standup": services.generate_standup()}


@app.get("/insights")
def get_insights() -> dict:
    """Generate productivity insights from today's tasks."""
    return {"insights": services.generate_insights()}


@app.get("/news")
def get_news() -> dict:
    """Get latest AI and tech news."""
    return services.get_ai_news()
