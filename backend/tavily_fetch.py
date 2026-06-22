"""Fetch news, quotes, and insights from Tavily API."""

import os
import requests
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")


def search_tavily(
    query: str,
    max_results: int = 5,
    include_answer: bool = True,
    topic: str = "general"
) -> dict:
    """
    Search Tavily for information.

    Args:
        query: Search query string
        max_results: Maximum number of results to return
        include_answer: Include AI-generated answer
        topic: Topic context (general, news)

    Returns:
        Dictionary with search results and optional answer
    """
    if not TAVILY_API_KEY:
        return {"error": "TAVILY_API_KEY not set"}

    try:
        response = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": TAVILY_API_KEY,
                "query": query,
                "max_results": max_results,
                "include_answer": include_answer,
                "topic": topic,
            },
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}


def get_productivity_tip() -> Optional[str]:
    """Get a productivity tip for developers."""
    result = search_tavily(
        "productivity tip for developers",
        max_results=1,
        include_answer=True
    )
    if "answer" in result:
        return result["answer"]
    elif "results" in result and result["results"]:
        return result["results"][0].get("content", "")
    return None


def get_tech_news() -> list[dict]:
    """Get latest tech news."""
    result = search_tavily(
        "latest tech news",
        max_results=5,
        topic="news"
    )
    if "results" in result:
        return [
            {
                "title": r.get("title", ""),
                "source": r.get("source", ""),
                "content": r.get("content", ""),
                "url": r.get("url", "")
            }
            for r in result["results"]
        ]
    return []


def get_motivational_quote() -> Optional[str]:
    """Get a motivational quote."""
    result = search_tavily(
        "motivational quote for productivity",
        max_results=1,
        include_answer=True
    )
    if "answer" in result:
        return result["answer"]
    return None


def get_developer_insights() -> Optional[str]:
    """Get developer insights and best practices."""
    result = search_tavily(
        "software development best practices 2025",
        max_results=3,
        include_answer=True
    )
    if "answer" in result:
        return result["answer"]
    return None


if __name__ == "__main__":
    print("=== Tavily API Test ===\n")

    # Test productivity tip
    print("📌 Productivity Tip:")
    tip = get_productivity_tip()
    print(tip or "No tip available")
    print()

    # Test motivational quote
    print("💡 Motivational Quote:")
    quote = get_motivational_quote()
    print(quote or "No quote available")
    print()

    # Test tech news
    print("📰 Tech News:")
    news = get_tech_news()
    for item in news[:3]:
        print(f"- {item['title']}")
        print(f"  Source: {item['source']}")
        print()

    # Test developer insights
    print("🔍 Developer Insights:")
    insights = get_developer_insights()
    print(insights or "No insights available")
