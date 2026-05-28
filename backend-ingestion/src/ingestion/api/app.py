"""FastAPI app — knowledge base read API for analysis + frontend."""

from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ingestion.settings import get_settings
from ingestion.storage import BrandRepository

app = FastAPI(title="Trigger Discovery — Ingestion API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ingestion"}


@app.get("/brands")
def list_brands() -> list[dict]:
    settings = get_settings()
    repo = BrandRepository(settings)
    root = settings.data_dir / "brands"
    if not root.exists():
        return []
    brands = []
    for d in root.iterdir():
        if d.is_dir() and (d / "brand.json").exists():
            import json

            brands.append(json.loads((d / "brand.json").read_text()))
    return brands


@app.get("/brands/{brand_id}/facts")
def get_facts(brand_id: str) -> list[dict]:
    repo = BrandRepository(get_settings())
    path = repo.ingestion_dir(brand_id) / "normalized" / "facts.jsonl"
    if not repo.brand_dir(brand_id).exists():
        raise HTTPException(404, "Brand not found")
    return repo.read_jsonl(path)


@app.get("/brands/{brand_id}/source-pages")
def get_source_pages(brand_id: str) -> list[dict]:
    repo = BrandRepository(get_settings())
    path = repo.ingestion_dir(brand_id) / "source_pages.jsonl"
    if not repo.brand_dir(brand_id).exists():
        raise HTTPException(404, "Brand not found")
    return repo.read_jsonl(path)
