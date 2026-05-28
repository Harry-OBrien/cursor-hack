"""CLI entrypoint for brand ingestion jobs."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional
from uuid import uuid4

import typer
from dotenv import load_dotenv

from ingestion.models import BrandInput
from ingestion.pipeline import IngestionPipeline
from ingestion.settings import get_settings

load_dotenv()
app = typer.Typer(help="Brand ingestion (Tavily crawl/extract/normalize)")


@app.command()
def ingest(
    name: str = typer.Option(..., help="Brand display name"),
    domain: str = typer.Option(..., help="Primary domain, e.g. acme.com"),
    competitors: Optional[str] = typer.Option(
        None, help="Comma-separated competitor domains"
    ),
    topics: Optional[str] = typer.Option(None, help="Comma-separated seed topics"),
) -> None:
    """Run full ingestion: crawl, extract, normalize, persist."""
    settings = get_settings()
    brand_input = BrandInput(
        name=name,
        primary_domain=domain,
        competitor_domains=_split(competitors),
        seed_topics=_split(topics),
    )
    pipeline = IngestionPipeline(settings)
    result = pipeline.run(brand_input)
    typer.echo(json.dumps(result, indent=2, default=str))


@app.command()
def serve(host: str = "127.0.0.1", port: int = 8001) -> None:
    """Start local knowledge-base API."""
    import uvicorn

    uvicorn.run("ingestion.api.app:app", host=host, port=port, reload=True)


def _split(value: Optional[str]) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in value.split(",") if part.strip()]


if __name__ == "__main__":
    app()
