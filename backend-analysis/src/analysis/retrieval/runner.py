"""Run prompts against in-memory corpus built from normalized facts."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from analysis.models import utc_now


class RetrievalRunner:
    """MVP: keyword overlap retrieval. TODO: embeddings / BM25."""

    def __init__(self, facts: list[dict[str, Any]]) -> None:
        self._corpus = facts

    def run_prompt(self, prompt: dict[str, Any]) -> dict[str, Any]:
        query_terms = set(prompt["text"].lower().split())
        scored: list[tuple[float, dict[str, Any]]] = []
        for fact in self._corpus:
            blob = " ".join(
                [
                    fact.get("summary") or "",
                    " ".join(fact.get("features") or []),
                    " ".join(fact.get("pain_points") or []),
                ]
            ).lower()
            overlap = len(query_terms & set(blob.split()))
            if overlap:
                scored.append((float(overlap), fact))
        scored.sort(key=lambda x: x[0], reverse=True)
        top = scored[:5]

        fragments = []
        source_page_ids = []
        for rank, (_, fact) in enumerate(top, start=1):
            sid = fact.get("source_page_id", "")
            if sid:
                source_page_ids.append(sid)
            fragments.append(
                {
                    "response_fragment_id": str(uuid4()),
                    "text": fact.get("summary") or fact.get("title", ""),
                    "source_page_id": sid,
                    "rank_position": rank,
                    "snippet_score": 1.0 / rank,
                }
            )

        return {
            "prompt_run_id": str(uuid4()),
            "prompt_id": prompt["prompt_id"],
            "brand_id": prompt["brand_id"],
            "status": "completed",
            "source_page_ids": list(dict.fromkeys(source_page_ids)),
            "response_text": "\n".join(f["text"] for f in fragments),
            "fragments": fragments,
            "ran_at": utc_now(),
        }
