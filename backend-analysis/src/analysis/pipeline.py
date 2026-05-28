from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from uuid import uuid4

from analysis.extraction.trigger_extractor import TriggerExtractor
from analysis.export.ranked_export import write_ranked_export
from analysis.ingestion_client import IngestionClient
from analysis.prompts.generator import PromptGenerator
from analysis.prompts.library import PromptLibrary
from analysis.retrieval.runner import RetrievalRunner
from analysis.scoring.service import TriggerScoringService
from analysis.settings import Settings
from analysis.models import utc_now


class AnalysisPipeline:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._ingestion = IngestionClient(settings)

    def _analysis_dir(self, brand_id: str) -> Path:
        return self._settings.data_dir / "brands" / brand_id / "analysis"

    def generate_prompts_only(self, brand_id: str) -> int:
        facts = self._ingestion.load_facts(brand_id)
        prompts = PromptGenerator().generate(brand_id, facts)
        PromptLibrary(self._analysis_dir(brand_id) / "prompts.jsonl").save(prompts)
        return len(prompts)

    def run(self, brand_id: str) -> dict[str, Any]:
        batch_run_id = str(uuid4())
        facts = self._ingestion.load_facts(brand_id)
        adir = self._analysis_dir(brand_id)

        prompts = PromptGenerator().generate(brand_id, facts)
        PromptLibrary(adir / "prompts.jsonl").save(prompts)

        runner = RetrievalRunner(facts)
        prompt_runs: list[dict[str, Any]] = []
        all_fragments: list[dict[str, Any]] = []

        for prompt in prompts:
            run = runner.run_prompt(prompt)
            run["batch_run_id"] = batch_run_id
            fragments = run.pop("fragments", [])
            for frag in fragments:
                frag["prompt_run_id"] = run["prompt_run_id"]
                all_fragments.append(frag)
            prompt_runs.append(run)

        _write_jsonl(adir / "prompt_runs.jsonl", prompt_runs)
        _write_jsonl(adir / "response_fragments.jsonl", all_fragments)

        extractor = TriggerExtractor()
        counts = extractor.extract(prompt_runs)
        raw_candidates = extractor.to_candidates(
            counts,
            brand_id=brand_id,
            batch_run_id=batch_run_id,
            prompt_runs=prompt_runs,
            intent_by_prompt={p["prompt_id"]: p["intent_bucket"] for p in prompts},
        )

        scorer = TriggerScoringService(self._settings.scoring_config)
        triggers = scorer.score(raw_candidates)
        _write_jsonl(adir / "triggers.jsonl", triggers)

        version = self._settings.scoring_config.get("version", "1.0.0")
        export_path = adir / "export" / "ranked_triggers.json"
        write_ranked_export(
            export_path,
            brand_id=brand_id,
            batch_run_id=batch_run_id,
            scoring_config_version=version,
            triggers=triggers,
        )

        batch_run = {
            "batch_run_id": batch_run_id,
            "brand_id": brand_id,
            "run_type": "analysis",
            "status": "completed",
            "started_at": utc_now(),
            "finished_at": utc_now(),
            "scoring_config_version": version,
            "stats": {
                "prompts": len(prompts),
                "prompt_runs": len(prompt_runs),
                "triggers": len(triggers),
            },
            "errors": [],
        }
        (adir / "batch_run.json").write_text(json.dumps(batch_run, indent=2))

        return {
            "brand_id": brand_id,
            "batch_run_id": batch_run_id,
            "prompts": len(prompts),
            "triggers": len(triggers),
            "export_path": str(export_path),
        }


def _write_jsonl(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        for row in rows:
            f.write(json.dumps(row) + "\n")
