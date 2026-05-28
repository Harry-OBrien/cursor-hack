# Backend — Ingestion (Engineer 1)

Tavily crawl/extract, normalization, and brand knowledge base storage.

## Quick start

```bash
cd backend-ingestion
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env   # set TAVILY_API_KEY
python -m ingestion.cli ingest --name "Acme" --domain acme.com
```

## CLI commands (planned)

| Command | Description |
|---------|-------------|
| `ingest` | Full crawl + extract + normalize for one brand |
| `crawl` | Tavily crawl only |
| `extract` | Tavily extract for discovered URLs |
| `normalize` | Re-run normalization from raw |
| `serve` | Local API on port 8001 |

## Outputs

Writes under `../data/brands/{brand_id}/ingestion/` per `shared/README.md`.

## Interface for Engineer 2

- `GET /brands/{brand_id}/facts` — normalized facts
- `GET /brands/{brand_id}/source-pages` — crawl metadata
- Files: `normalized/facts.jsonl`, `source_pages.jsonl`

## Definition of done

- [ ] One command ingests a brand from domain
- [ ] Pages classified (`page_type`)
- [ ] Normalized facts queryable without manual cleanup
- [ ] Rerunnable ingestion job with dedup + traceability
