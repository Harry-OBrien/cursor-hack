"""Synthetic prompt generation from brand facts."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

INTENT_BUCKETS = [
    "informational",
    "commercial_investigation",
    "transactional",
    "comparison",
    "problem_solution",
    "alternative_switching",
]

PERSONAS = ["evaluator", "buyer", "operator", "switcher"]


class PromptGenerator:
    """TODO: expand templates; use LLM for variety."""

    def generate(self, brand_id: str, facts: list[dict[str, Any]]) -> list[dict[str, Any]]:
        prompts: list[dict[str, Any]] = []
        features = _flat(facts, "features")
        pain_points = _flat(facts, "pain_points")
        competitors = _flat(facts, "competitor_mentions")

        for intent in INTENT_BUCKETS:
            for persona in PERSONAS:
                text = _template(intent, persona, features, pain_points, competitors)
                if not text:
                    continue
                prompts.append(
                    {
                        "prompt_id": str(uuid4()),
                        "brand_id": brand_id,
                        "text": text,
                        "intent_bucket": intent,
                        "persona": persona,
                        "is_high_intent": intent
                        in ("transactional", "comparison", "alternative_switching"),
                        "seed_fact_ids": [],
                    }
                )
        return prompts


def _flat(facts: list[dict], key: str) -> list[str]:
    out: list[str] = []
    for f in facts:
        out.extend(f.get(key) or [])
    return list(dict.fromkeys(out))[:10]


def _template(
    intent: str,
    persona: str,
    features: list[str],
    pain_points: list[str],
    competitors: list[str],
) -> str:
    feat = features[0] if features else "your product"
    pain = pain_points[0] if pain_points else "reporting gaps"
    comp = competitors[0] if competitors else "incumbent tools"
    templates = {
        "informational": f"As a {persona}, how does {feat} work for teams?",
        "commercial_investigation": f"As a {persona}, what should I compare when evaluating {feat}?",
        "transactional": f"As a {persona}, what's the fastest way to buy a solution for {pain}?",
        "comparison": f"As a {persona}, how does {feat} compare to {comp}?",
        "problem_solution": f"As a {persona}, how do I fix {pain} without a big implementation?",
        "alternative_switching": f"As a {persona}, why switch from {comp} to something with {feat}?",
    }
    return templates.get(intent, "")
