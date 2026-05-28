"""CLI for analysis batch jobs."""

from __future__ import annotations

import json

import typer
from dotenv import load_dotenv

from analysis.fixtures import SAMPLE_BRAND_ID, seed_fixture_data
from analysis.pipeline import AnalysisPipeline
from analysis.settings import get_settings

load_dotenv()
app = typer.Typer(help="Trigger analysis (prompts, retrieval, scoring)")


@app.command("generate-prompts")
def generate_prompts(brand_id: str = typer.Option(..., "--brand-id")) -> None:
    pipeline = AnalysisPipeline(get_settings())
    count = pipeline.generate_prompts_only(brand_id)
    typer.echo(f"Generated {count} prompts for {brand_id}")


@app.command()
def analyze(brand_id: str = typer.Option(..., "--brand-id")) -> None:
    pipeline = AnalysisPipeline(get_settings())
    result = pipeline.run(brand_id)
    typer.echo(json.dumps(result, indent=2, default=str))


@app.command()
def score(brand_id: str = typer.Option(..., "--brand-id")) -> None:
    pipeline = AnalysisPipeline(get_settings())
    result = pipeline.rescore(brand_id)
    typer.echo(json.dumps(result, indent=2, default=str))


@app.command("seed-fixture")
def seed_fixture() -> None:
    paths = seed_fixture_data(get_settings().data_dir)
    typer.echo(json.dumps(paths, indent=2))
    typer.echo(f"Run: python -m analysis.cli analyze --brand-id {SAMPLE_BRAND_ID}")


@app.command()
def serve(host: str = "127.0.0.1", port: int = 8002) -> None:
    import uvicorn

    uvicorn.run("analysis.api.app:app", host=host, port=port, reload=True)


if __name__ == "__main__":
    app()
