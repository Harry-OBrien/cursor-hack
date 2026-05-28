# Trigger Discovery (Tavily + Cursor Hack)

MVP for collecting brand knowledge via **Tavily**, simulating user prompts, ranking high-intent **triggers**, and reviewing them in a dashboard before ad testing.

Full product plan: [tavily-cursor-agent-plan.md](./tavily-cursor-agent-plan.md)

## Team ownership

| Person | Directory | Port (local API) |
|--------|-----------|------------------|
| Backend Engineer 1 — Ingestion | [`backend-ingestion/`](./backend-ingestion/) | 8001 |
| Backend Engineer 2 — Analysis | [`backend-analysis/`](./backend-analysis/) | 8002 |
| Frontend Engineer | [`frontend-dashboard/`](./frontend-dashboard/) | 5173 |
| **All** — Contracts | [`shared/`](./shared/) | — |

## Repository layout

```
cursor-hack/
├── shared/                  # JSON schemas, scoring config, fixtures
├── backend-ingestion/       # Tavily crawl/extract, normalization, KB API
├── backend-analysis/        # Prompts, retrieval, trigger scoring, export
├── frontend-dashboard/      # Review UI
├── data/                    # Local brand data (gitignored)
├── tavily-cursor-agent-plan.md
└── docker-compose.yml       # Optional: run all services
```

## End-to-end flow

1. **Ingestion**: `python -m ingestion.cli ingest --name Acme --domain acme.com`
2. **Analysis**: `python -m analysis.cli analyze --brand-id <uuid>`
3. **Frontend**: `npm run dev` → review triggers, approve/export

## Shared contracts

Before coding in parallel, align on:

- Entity IDs and JSON schemas in `shared/schemas/`
- On-disk layout in `shared/README.md`
- Frontend export: `data/brands/{id}/analysis/export/ranked_triggers.json`

## Environment

- Python 3.9+ (3.11+ recommended)
- Node 20+
- `TAVILY_API_KEY` for ingestion (Engineer 1)

Copy each package's `.env.example` to `.env`.

## Getting started (all services)

```bash
# Terminal 1 — ingestion
cd backend-ingestion && pip install -e ".[dev]" && python -m ingestion.cli serve

# Terminal 2 — analysis
cd backend-analysis && pip install -e ".[dev]" && python -m analysis.cli serve

# Terminal 3 — frontend
cd frontend-dashboard && npm install && npm run dev
```

Or: `docker compose up` (after images are added by the team).
