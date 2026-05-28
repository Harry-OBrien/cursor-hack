# Shared contracts

Cross-team schemas, config, and fixtures. **Do not change field names without coordinating all three owners.**

## Entities

| Schema | Owner (primary writer) | Consumers |
|--------|------------------------|-----------|
| `brand.json` | Ingestion | All |
| `source_page.json` | Ingestion | Analysis, Frontend |
| `normalized_fact.json` | Ingestion | Analysis |
| `batch_run.json` | Ingestion (crawl) / Analysis (prompt) | Frontend |
| `prompt.json` | Analysis | Frontend |
| `prompt_run.json` | Analysis | Frontend |
| `response_fragment.json` | Analysis | Frontend |
| `trigger_candidate.json` | Analysis | Frontend |
| `trigger_decision.json` | Frontend (writes) | Analysis (optional read) |
| `error.json` | All | Frontend |

## IDs

Use UUID v4 strings for: `brand_id`, `source_page_id`, `normalized_fact_id`, `batch_run_id`, `prompt_id`, `prompt_run_id`, `response_fragment_id`, `trigger_candidate_id`, `trigger_decision_id`.

## Data paths (local MVP)

```
data/
  brands/{brand_id}/
    brand.json
    ingestion/
      raw/
      normalized/
      source_pages.jsonl
    analysis/
      prompts.jsonl
      prompt_runs.jsonl
      triggers.jsonl
      export/ranked_triggers.json
```

## Scoring config

`config/scoring.default.json` is versioned. Analysis reads `scoring_config_version` from batch run metadata.
