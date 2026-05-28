"""Read/write brand data under data/brands/{brand_id}."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Iterable

from ingestion.settings import Settings


class BrandRepository:
    def __init__(self, settings: Settings) -> None:
        self._root = settings.data_dir / "brands"

    def brand_dir(self, brand_id: str) -> Path:
        return self._root / brand_id

    def ingestion_dir(self, brand_id: str) -> Path:
        return self.brand_dir(brand_id) / "ingestion"

    def save_brand(self, brand: dict[str, Any]) -> Path:
        d = self.brand_dir(brand["brand_id"])
        d.mkdir(parents=True, exist_ok=True)
        path = d / "brand.json"
        path.write_text(json.dumps(brand, indent=2))
        return path

    def write_jsonl(self, path: Path, rows: Iterable[dict[str, Any]]) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w") as f:
            for row in rows:
                f.write(json.dumps(row) + "\n")

    def read_jsonl(self, path: Path) -> list[dict[str, Any]]:
        if not path.exists():
            return []
        return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]
