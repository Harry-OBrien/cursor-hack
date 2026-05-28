# Backend — Analysis (Engineer 2)

Synthetic prompts, corpus retrieval, trigger extraction, and scoring.

## Quick start

```bash
cd backend-analysis
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
python -m analysis.cli analyze --brand-id <uuid>
```

## Depends on Engineer 1

Reads `../data/brands/{brand_id}/ingestion/normalized/facts.jsonl` or ingestion API `http://localhost:8001`.

## CLI commands (planned)

| Command | Description |
|---------|-------------|
| `generate-prompts` | Build prompt library from brand facts |
| `analyze` | Full batch: prompts → retrieval → triggers → export |
| `score` | Re-score triggers with config version |
| `serve` | Local API on port 8002 |

## Outputs

- `analysis/prompts.jsonl`
- `analysis/prompt_runs.jsonl`
- `analysis/triggers.jsonl`
- `analysis/export/ranked_triggers.json` (frontend contract)

## Definition of done

- [ ] Batch prompts against one brand corpus
- [ ] Ranked triggers with traceability (prompts, pages, responses)
- [ ] Stable export JSON for frontend
