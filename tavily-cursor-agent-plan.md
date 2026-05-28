# Tavily-Only Trigger Discovery Plan

This document breaks the product into three implementation sections for a team of **three people**: **two backend engineers** and **one frontend engineer**. The scope assumes **Tavily only** for external data collection in version 1, with future room to connect campaign and CPC data later.

## Team split

| Owner | Focus | Primary responsibility |
|---|---|---|
| Backend Engineer 1 | Data ingestion and normalization | Collect and structure brand data from Tavily |
| Backend Engineer 2 | Query analysis and scoring | Generate prompts, analyze responses, and rank triggers |
| Frontend Engineer | Review and workflow UI | Present results, runs, triggers, and decision tools to users |

---

## Section 1 — Backend Engineer 1: Ingestion and Brand Knowledge Base

### Objective
Build the pipeline that collects brand-relevant content from the public web using Tavily and converts it into a clean internal knowledge base.

### Responsibilities
- Accept a brand input package:
  - Brand name
  - Primary domain
  - Optional competitor domains
  - Optional seed topics
- Use Tavily Crawl to discover and retrieve pages from the brand website.
- Use Tavily Extract to pull structured content from important pages such as:
  - Homepage
  - Product pages
  - Pricing pages
  - Help/docs pages
  - Blog posts
  - Comparison pages
- Store both raw extracted content and normalized records.
- Create a lightweight schema for reusable brand facts.
- Expose this data to the rest of the system through files, database tables, or an internal API.

### Output schema
Each normalized record should support fields like:
- `url`
- `page_type`
- `title`
- `summary`
- `products`
- `features`
- `pain_points`
- `customer_types`
- `industries`
- `pricing_terms`
- `brand_phrases`
- `competitor_mentions`
- `last_crawled_at`

### Rules
- Deduplicate near-identical pages.
- Strip boilerplate where possible.
- Tag content by confidence and source type.
- Preserve traceability back to source URL.
- Make the ingestion job rerunnable for scheduled refreshes.
- Keep interfaces stable for Backend Engineer 2 and the frontend.

### Deliverables
- Tavily client wrapper
- Crawl/extract job runner
- Normalization pipeline
- Storage schema for raw + normalized content
- Brand knowledge base API or local query layer

### Definition of done
- A new brand can be ingested from a domain with one command.
- Important pages are classified and stored.
- Normalized facts can be queried reliably by downstream services.
- Backend Engineer 2 can consume the data without manual cleanup.

---

## Section 2 — Backend Engineer 2: Synthetic Query Generation, Response Analysis, and Scoring

### Objective
Build the system that generates realistic user prompts, runs retrieval against the Tavily-derived brand corpus, and measures which keywords, phrases, and topics appear most often in results. Then convert those findings into ranked trigger opportunities.

### Responsibilities
- Generate synthetic prompts across intent buckets such as:
  - Informational
  - Commercial investigation
  - Transactional
  - Comparison
  - Problem/solution
  - Alternative/competitor-switching
- Allow prompt generation from:
  - Brand facts from Section 1
  - Product features
  - Pain points
  - Competitor names
  - Industry/category terms
- Run each prompt against the internal retrieval layer built from the Tavily-ingested corpus.
- Capture returned snippets, passages, or generated answer text.
- Extract:
  - Unigrams
  - Bigrams
  - Key phrases
  - Entities
  - Co-occurring terms
- Compute frequencies and weighted relevance scores.
- Rank triggers using a simple optimization model.
- Prepare output that the frontend can display clearly.

### Core metrics
For each trigger candidate, calculate:
- `appearance_count`
- `appearance_rate`
- `avg_rank_position`
- `intent_bucket`
- `brand_proximity_score`
- `commercial_intent_score`
- `competitor_overlap_score`
- `source_coverage`
- `trigger_score`
- `recommended_action`

### Suggested scoring model
Use a weighted score such as:

`trigger_score = frequency_score + intent_score + relevance_score + distinctiveness_score - ambiguity_penalty`

Possible subcomponents:
- `frequency_score`: how often the trigger appears across prompts/results
- `intent_score`: whether the phrase suggests buying, comparing, evaluating, or solving a near-term problem
- `relevance_score`: how tightly it maps to core brand offerings
- `distinctiveness_score`: whether it is specific enough to avoid broad wasted targeting
- `ambiguity_penalty`: whether the phrase is generic, noisy, or context-dependent

### Rules
- Keep prompts grouped by persona and intent.
- Separate broad prompts from high-intent prompts.
- Track which source documents influenced each response.
- Do not treat raw frequency alone as success.
- Support periodic reruns as the brand corpus changes.
- Design the output so future CPC and campaign metrics can be attached later.

### Deliverables
- Synthetic query generator
- Prompt library format
- Retrieval/evaluation runner
- Trigger extraction pipeline
- Metrics tables for phrases and topics
- Trigger scoring service
- Ranked export for frontend consumption

### Definition of done
- The system can run a batch of prompts against one brand.
- It produces a ranked list of recurring triggers.
- Each trigger can be traced back to prompts, responses, and source pages.
- The frontend receives a stable output format for results and drill-down views.

---

## Section 3 — Frontend Engineer: Review Dashboard and User Workflow

### Objective
Build the interface that lets users run a brand analysis, inspect crawl results, review discovered triggers, and understand why certain triggers were recommended.

### Responsibilities
- Create the main workflow screens:
  - Brand setup screen
  - Run status / job progress screen
  - Brand knowledge overview
  - Trigger ranking dashboard
  - Trigger detail view
  - Export/review screen
- Display source traceability clearly:
  - Which pages were crawled
  - Which prompts produced a trigger
  - Which responses included the trigger
- Give users a way to filter results by:
  - Intent bucket
  - Trigger score
  - Phrase length
  - Page type
  - Competitor presence
- Support manual review actions such as:
  - Approve
  - Reject
  - Flag as too broad
  - Mark for testing
- Build around backend output rather than hardcoding assumptions.

### Core UI components
- Brand/project selector
- Crawl summary cards
- Prompt-run table
- Trigger ranking table
- Trigger detail drawer or modal
- Source evidence panel
- Export action bar
- Status and error states

### Rules
- Make evidence easy to audit.
- Prioritize usability over visual complexity.
- Handle partial and loading states cleanly.
- Keep the UI modular so future CPC or ad platform metrics can be added later.
- Use stable contracts from the backend and document assumptions early.

### Deliverables
- Frontend app structure and routes
- Shared UI component library for tables/cards/filters
- Dashboard for ranked trigger review
- Detail views for prompts, responses, and source pages
- Export-ready review workflow

### Definition of done
- A user can create or open a brand project.
- A user can see crawl progress and ingestion results.
- A user can review ranked triggers and inspect supporting evidence.
- A user can export or hand off shortlisted triggers for campaign testing.

---

## Shared contracts

All three contributors should align on the following before implementation begins:
- common IDs for brands, prompts, responses, source pages, and triggers
- shared JSON schemas
- reproducible batch run metadata
- versioned scoring configs
- source traceability for every derived insight
- error contract for failed crawls, partial runs, and missing data

### Suggested shared entities
- `Brand`
- `SourcePage`
- `NormalizedFact`
- `Prompt`
- `PromptRun`
- `ResponseFragment`
- `TriggerCandidate`
- `TriggerDecision`

---

## End-to-end flow

1. Backend Engineer 1 ingests brand content with Tavily.
2. Backend Engineer 1 normalizes content into reusable brand facts.
3. Backend Engineer 2 generates synthetic prompts.
4. Backend Engineer 2 runs prompt-response analysis.
5. Backend Engineer 2 extracts recurring triggers and scores them.
6. Frontend Engineer displays the ranked output and evidence.
7. Users review and export shortlisted triggers for future ad testing.

---

## Suggested repository split

- `backend-ingestion/`
- `backend-analysis/`
- `frontend-dashboard/`
- `shared/` for schemas, config, utilities, and fixtures

---

## MVP boundary

Keep version 1 intentionally narrow:
- One brand at a time
- One primary domain
- Optional competitors
- Batch runs instead of full real-time analysis
- Human-in-the-loop review before any campaign activation
- Tavily as the only external data collection dependency

---

## Final product statement

This product uses Tavily to collect and structure brand knowledge, simulate realistic user prompts, identify recurring high-intent triggers in the resulting responses, and rank those triggers in a UI that supports human review before advertising decisions are made.
