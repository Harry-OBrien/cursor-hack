"""Weighted trigger scoring per shared/config/scoring.default.json."""

from __future__ import annotations

from typing import Any
from uuid import uuid4


class TriggerScoringService:
    def __init__(self, config: dict[str, Any]) -> None:
        self._config = config

    def score(self, candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
        weights = self._config.get("weights", {})
        thresholds = self._config.get("thresholds", {})
        scored: list[dict[str, Any]] = []

        max_count = max((c["appearance_count"] for c in candidates), default=1)

        for c in candidates:
            frequency_score = (c["appearance_count"] / max_count) * weights.get(
                "frequency", 0.3
            )
            intent_score = weights.get("intent", 0.25) * (
                1.0 if c.get("intent_bucket") != "mixed" else 0.5
            )
            relevance_score = weights.get("relevance", 0.25) * min(
                1.0, c.get("appearance_rate", 0) * 2
            )
            distinctiveness_score = weights.get("distinctiveness", 0.15) * (
                1.0 if len(c["phrase"].split()) > 1 else 0.6
            )
            ambiguity_penalty = weights.get("ambiguity_penalty", 0.05) * (
                1.0 if len(c["phrase"]) < 5 else 0.0
            )
            trigger_score = (
                frequency_score
                + intent_score
                + relevance_score
                + distinctiveness_score
                - ambiguity_penalty
            )
            c = {
                **c,
                "trigger_candidate_id": str(uuid4()),
                "trigger_score": round(trigger_score, 4),
                "avg_rank_position": 2.5,
                "brand_proximity_score": relevance_score,
                "commercial_intent_score": intent_score,
                "competitor_overlap_score": 0.0,
                "source_coverage": min(1.0, len(c.get("source_page_ids", [])) / 10),
                "recommended_action": _action(trigger_score, thresholds),
                "score_breakdown": {
                    "frequency_score": frequency_score,
                    "intent_score": intent_score,
                    "relevance_score": relevance_score,
                    "distinctiveness_score": distinctiveness_score,
                    "ambiguity_penalty": ambiguity_penalty,
                },
            }
            scored.append(c)

        scored.sort(key=lambda x: x["trigger_score"], reverse=True)
        return scored


def _action(score: float, thresholds: dict[str, float]) -> str:
    if score >= thresholds.get("prioritize", 0.75):
        return "prioritize"
    if score >= thresholds.get("test", 0.55):
        return "test"
    if score >= thresholds.get("monitor", 0.35):
        return "monitor"
    return "deprioritize"
