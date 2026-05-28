"""End-to-end ingestion orchestration."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from ingestion.crawl_runner import CrawlRunner
from ingestion.extract_runner import ExtractRunner
from ingestion.models import Brand, BrandInput, utc_now
from ingestion.normalization import NormalizationPipeline
from ingestion.settings import Settings
from ingestion.storage import BrandRepository
from ingestion.tavily_client import TavilyClient


class IngestionPipeline:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._repo = BrandRepository(settings)
        self._client = TavilyClient(settings)
        self._crawl = CrawlRunner(self._client)
        self._extract = ExtractRunner(self._client)
        self._normalize = NormalizationPipeline()

    def run(self, brand_input: BrandInput) -> dict[str, Any]:
        brand = Brand.from_input(brand_input)
        batch_run_id = str(uuid4())

        self._repo.save_brand(brand.to_dict())

        # TODO: replace stubs when Tavily client is implemented
        try:
            discovered = self._crawl.run(brand.primary_domain)
            urls = [p.get("url", "") for p in discovered if p.get("url")]
            raw_pages = self._extract.run(urls) if urls else []
        except NotImplementedError:
            raw_pages = []

        source_pages, facts = self._normalize.run(brand.brand_id, raw_pages)
        ing = self._repo.ingestion_dir(brand.brand_id)
        self._repo.write_jsonl(ing / "source_pages.jsonl", source_pages)
        self._repo.write_jsonl(ing / "normalized" / "facts.jsonl", facts)

        batch_run = {
            "batch_run_id": batch_run_id,
            "brand_id": brand.brand_id,
            "run_type": "ingestion",
            "status": "completed" if facts else "partial",
            "started_at": utc_now(),
            "finished_at": utc_now(),
            "stats": {
                "source_pages": len(source_pages),
                "normalized_facts": len(facts),
            },
            "errors": [],
        }
        (ing / "batch_run.json").write_text(
            __import__("json").dumps(batch_run, indent=2)
        )

        return {
            "brand_id": brand.brand_id,
            "batch_run_id": batch_run_id,
            "source_pages": len(source_pages),
            "normalized_facts": len(facts),
        }
