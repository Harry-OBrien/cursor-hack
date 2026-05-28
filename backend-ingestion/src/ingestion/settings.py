"""Runtime configuration."""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    tavily_api_key: str
    data_dir: Path
    schemas_dir: Path


@lru_cache
def get_settings() -> Settings:
    repo_root = Path(__file__).resolve().parents[3]
    return Settings(
        tavily_api_key=os.getenv("TAVILY_API_KEY", ""),
        data_dir=Path(os.getenv("DATA_DIR", repo_root / "data")),
        schemas_dir=Path(
            os.getenv("SHARED_SCHEMAS_DIR", repo_root / "shared" / "schemas")
        ),
    )
