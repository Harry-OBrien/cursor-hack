"""Fetch brand facts from ingestion API or local files."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import httpx

from analysis.settings import Settings


class IngestionClient:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def load_facts(self, brand_id: str) -> list[dict[str, Any]]:
        local = (
            self._settings.data_dir
            / "brands"
            / brand_id
            / "ingestion"
            / "normalized"
            / "facts.jsonl"
        )
        if local.exists():
            return [
                __import__("json").loads(line)
                for line in local.read_text().splitlines()
                if line.strip()
            ]
        with httpx.Client() as client:
            r = client.get(
                f"{self._settings.ingestion_api_url}/brands/{brand_id}/facts"
            )
            r.raise_for_status()
            return r.json()
