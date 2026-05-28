from __future__ import annotations

import json
import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    data_dir: Path
    ingestion_api_url: str
    schemas_dir: Path
    scoring_config_path: Path

    @property
    def scoring_config(self) -> dict:
        return json.loads(self.scoring_config_path.read_text())


@lru_cache
def get_settings() -> Settings:
    repo_root = Path(__file__).resolve().parents[3]
    return Settings(
        data_dir=Path(os.getenv("DATA_DIR", repo_root / "data")),
        ingestion_api_url=os.getenv("INGESTION_API_URL", "http://127.0.0.1:8001"),
        schemas_dir=Path(
            os.getenv("SHARED_SCHEMAS_DIR", repo_root / "shared" / "schemas")
        ),
        scoring_config_path=Path(
            os.getenv(
                "SCORING_CONFIG",
                repo_root / "shared" / "config" / "scoring.default.json",
            )
        ),
    )
