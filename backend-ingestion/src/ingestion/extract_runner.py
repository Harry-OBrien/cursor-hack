"""Orchestrates Tavily extract for prioritized URLs."""

from __future__ import annotations

from typing import Any

from ingestion.tavily_client import TavilyClient

PRIORITY_PATH_HINTS = (
    "/pricing",
    "/product",
    "/docs",
    "/blog",
    "/compare",
)


class ExtractRunner:
    def __init__(self, client: TavilyClient) -> None:
        self._client = client

    def prioritize_urls(self, urls: list[str], *, limit: int = 50) -> list[str]:
        """Rank URLs for extract budget (homepage, product, pricing first)."""
        def score(url: str) -> int:
            lower = url.lower()
            if lower.endswith("/") or lower.count("/") <= 3:
                return 0
            for i, hint in enumerate(PRIORITY_PATH_HINTS, start=1):
                if hint in lower:
                    return i
            return 99

        return sorted(urls, key=score)[:limit]

    def run(self, urls: list[str]) -> list[dict[str, Any]]:
        prioritized = self.prioritize_urls(urls)
        return self._client.extract(prioritized)
