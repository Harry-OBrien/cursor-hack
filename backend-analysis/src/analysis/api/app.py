from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from analysis.settings import get_settings

app = FastAPI(title="Trigger Discovery — Analysis API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _analysis_dir(brand_id: str) -> Path:
    return get_settings().data_dir / "brands" / brand_id / "analysis"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "analysis"}


@app.get("/brands/{brand_id}/triggers")
def get_triggers(brand_id: str) -> dict:
    export = _analysis_dir(brand_id) / "export" / "ranked_triggers.json"
    if not export.exists():
        raise HTTPException(404, "No analysis export for brand")
    return json.loads(export.read_text())


@app.get("/brands/{brand_id}/prompt-runs")
def get_prompt_runs(brand_id: str) -> list[dict]:
    path = _analysis_dir(brand_id) / "prompt_runs.jsonl"
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


@app.get("/brands/{brand_id}/batch-run")
def get_batch_run(brand_id: str) -> dict:
    path = _analysis_dir(brand_id) / "batch_run.json"
    if not path.exists():
        raise HTTPException(404, "No analysis batch run for brand")
    return json.loads(path.read_text())
