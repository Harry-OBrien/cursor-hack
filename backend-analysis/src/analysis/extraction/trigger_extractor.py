"""Extract unigrams, bigrams, key phrases from prompt runs."""

from __future__ import annotations

import re
from collections import Counter, defaultdict
from typing import Any

WORD_RE = re.compile(r"[a-z0-9][a-z0-9\-]{2,}")


class TriggerExtractor:
    STOPWORDS = frozenset(
        "the a an and or for to of in on with is are was were be been being".split()
    )

    def extract(self, prompt_runs: list[dict[str, Any]]) -> Counter[str]:
        counts: Counter[str] = Counter()
        for run in prompt_runs:
            text = (run.get("response_text") or "").lower()
            tokens = [t for t in WORD_RE.findall(text) if t not in self.STOPWORDS]
            counts.update(tokens)
            for i in range(len(tokens) - 1):
                counts[f"{tokens[i]} {tokens[i+1]}"] += 1
        return counts

    def to_candidates(
        self,
        counts: Counter[str],
        *,
        brand_id: str,
        batch_run_id: str,
        prompt_runs: list[dict[str, Any]],
        intent_by_prompt: dict[str, str],
    ) -> list[dict[str, Any]]:
        total_runs = max(len(prompt_runs), 1)
        candidates: list[dict[str, Any]] = []
        for phrase, count in counts.most_common(100):
            phrase_type = "bigram" if " " in phrase else "unigram"
            appearance_rate = count / total_runs
            candidates.append(
                {
                    "phrase": phrase,
                    "phrase_type": phrase_type,
                    "appearance_count": count,
                    "appearance_rate": appearance_rate,
                    "intent_bucket": "mixed",
                    "brand_id": brand_id,
                    "batch_run_id": batch_run_id,
                    "prompt_run_ids": [r["prompt_run_id"] for r in prompt_runs[:5]],
                    "source_page_ids": _collect_source_ids(prompt_runs),
                }
            )
        return candidates


def _collect_source_ids(runs: list[dict]) -> list[str]:
    ids: list[str] = []
    for r in runs:
        ids.extend(r.get("source_page_ids") or [])
    return list(dict.fromkeys(ids))[:20]
