"""Convert extracted pages into NormalizedFact schema."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from ingestion.models import utc_now


class NormalizationPipeline:
    """TODO: LLM or rules-based extraction into shared normalized_fact fields."""

    def run(
        self,
        brand_id: str,
        raw_pages: list[dict[str, Any]],
    ) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
        """
        Returns (source_pages, normalized_facts).
        Deduplicate by content_hash; strip boilerplate; tag confidence.
        """
        source_pages: list[dict[str, Any]] = []
        facts: list[dict[str, Any]] = []
        seen_hashes: set[str] = set()

        for page in raw_pages:
            content_hash = page.get("content_hash") or page.get("url", "")
            if content_hash in seen_hashes:
                continue
            seen_hashes.add(content_hash)

            source_page_id = str(uuid4())
            source_pages.append(
                {
                    "source_page_id": source_page_id,
                    "brand_id": brand_id,
                    "url": page.get("url", ""),
                    "page_type": page.get("page_type", "other"),
                    "title": page.get("title", ""),
                    "confidence": page.get("confidence", 0.5),
                    "source_type": page.get("source_type", "tavily_extract"),
                    "last_crawled_at": utc_now(),
                    "content_hash": content_hash,
                }
            )
            facts.append(
                {
                    "normalized_fact_id": str(uuid4()),
                    "brand_id": brand_id,
                    "source_page_id": source_page_id,
                    "url": page.get("url", ""),
                    "page_type": page.get("page_type", "other"),
                    "title": page.get("title", ""),
                    "summary": page.get("summary", ""),
                    "products": page.get("products", []),
                    "features": page.get("features", []),
                    "pain_points": page.get("pain_points", []),
                    "customer_types": page.get("customer_types", []),
                    "industries": page.get("industries", []),
                    "pricing_terms": page.get("pricing_terms", []),
                    "brand_phrases": page.get("brand_phrases", []),
                    "competitor_mentions": page.get("competitor_mentions", []),
                    "confidence": page.get("confidence", 0.5),
                    "source_type": page.get("source_type", "tavily_extract"),
                    "last_crawled_at": utc_now(),
                }
            )

        return source_pages, facts
