"""Thin wrapper around Tavily Crawl and Extract APIs."""

from __future__ import annotations

from typing import Any

import httpx

from ingestion.settings import Settings

TAVILY_BASE = "https://api.tavily.com"


class TavilyClient:
    """TODO: wire to official Tavily SDK or REST endpoints."""

    def __init__(self, settings: Settings) -> None:
        self._api_key = settings.tavily_api_key
        self._client = httpx.Client(
            base_url=TAVILY_BASE,
            headers={"Authorization": f"Bearer {self._api_key}"},
            timeout=60.0,
        )

    def crawl(self, domain: str, *, max_depth: int = 2) -> dict[str, Any]:
        """Discover URLs on a domain. Implement with Tavily Crawl."""
        raise NotImplementedError("Implement Tavily crawl")

    def extract(self, urls: list[str]) -> list[dict[str, Any]]:
        """Extract structured content from URLs. Implement with Tavily Extract."""
        raise NotImplementedError("Implement Tavily extract")

    def close(self) -> None:
        self._client.close()
