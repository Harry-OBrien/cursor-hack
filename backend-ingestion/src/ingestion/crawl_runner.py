"""Orchestrates Tavily crawl for a brand domain."""

from __future__ import annotations

from typing import Any

from ingestion.tavily_client import TavilyClient


class CrawlRunner:
    def __init__(self, client: TavilyClient) -> None:
        self._client = client

    def run(self, domain: str) -> list[dict[str, Any]]:
        """Return discovered page records with url, title hints, etc."""
        result = self._client.crawl(domain)
        return result.get("pages", []) if isinstance(result, dict) else []
