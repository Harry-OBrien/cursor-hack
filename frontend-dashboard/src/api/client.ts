import type {
  Brand,
  NormalizedFact,
  RankedTriggersExport,
  SourcePage,
  TriggerDecision,
} from "../types/contracts";

const ingestionBase =
  import.meta.env.VITE_INGESTION_API_URL ?? "http://127.0.0.1:8001";
const analysisBase =
  import.meta.env.VITE_ANALYSIS_API_URL ?? "http://127.0.0.1:8002";
const useMock = import.meta.env.VITE_USE_MOCK === "true";

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  listBrands: () =>
    useMock ? Promise.resolve(mockBrands) : get<Brand[]>(`${ingestionBase}/brands`),

  getFacts: (brandId: string) =>
    useMock
      ? Promise.resolve(mockFacts(brandId))
      : get<NormalizedFact[]>(`${ingestionBase}/brands/${brandId}/facts`),

  getSourcePages: (brandId: string) =>
    useMock
      ? Promise.resolve(mockSourcePages(brandId))
      : get<SourcePage[]>(`${ingestionBase}/brands/${brandId}/source-pages`),

  getTriggers: (brandId: string) =>
    useMock
      ? Promise.resolve(mockExport(brandId))
      : get<RankedTriggersExport>(
          `${analysisBase}/brands/${brandId}/triggers`
        ),

  saveDecision: async (decision: TriggerDecision) => {
    const key = `decisions:${decision.brand_id}`;
    const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
    existing.push(decision);
    localStorage.setItem(key, JSON.stringify(existing));
  },
};

const MOCK_BRAND_ID = "00000000-0000-4000-8000-000000000001";

const mockBrands: Brand[] = [
  {
    brand_id: MOCK_BRAND_ID,
    name: "Acme Analytics",
    primary_domain: "acme-analytics.example",
    competitor_domains: ["mixpanel.com", "amplitude.com"],
    seed_topics: ["product analytics", "funnel tracking"],
    created_at: "2026-05-28T12:00:00Z",
  },
];

function mockSourcePages(brandId: string): SourcePage[] {
  return [
    {
      source_page_id: "sp1",
      brand_id: brandId,
      url: `https://${mockBrands[0].primary_domain}/`,
      page_type: "homepage",
      title: "Acme Analytics — Product analytics for growth teams",
      last_crawled_at: "2026-05-28T10:00:00Z",
    },
    {
      source_page_id: "sp2",
      brand_id: brandId,
      url: `https://${mockBrands[0].primary_domain}/pricing`,
      page_type: "pricing",
      title: "Pricing — Acme Analytics",
      last_crawled_at: "2026-05-28T10:05:00Z",
    },
    {
      source_page_id: "sp3",
      brand_id: brandId,
      url: `https://${mockBrands[0].primary_domain}/features`,
      page_type: "product",
      title: "Features — Funnels, cohorts, retention",
      last_crawled_at: "2026-05-28T10:10:00Z",
    },
  ];
}

function mockFacts(brandId: string): NormalizedFact[] {
  return [
    {
      normalized_fact_id: "nf1",
      brand_id: brandId,
      source_page_id: "sp1",
      url: `https://${mockBrands[0].primary_domain}/`,
      page_type: "homepage",
      title: "Product analytics platform",
      summary: "Self-serve analytics for product and growth teams.",
      features: ["Funnel analysis", "Cohort retention", "Event tracking"],
      pain_points: ["Fragmented data", "Slow insight cycles"],
    },
    {
      normalized_fact_id: "nf2",
      brand_id: brandId,
      source_page_id: "sp2",
      url: `https://${mockBrands[0].primary_domain}/pricing`,
      page_type: "pricing",
      title: "Transparent pricing",
      summary: "Usage-based tiers starting at $99/mo for startups.",
    },
    {
      normalized_fact_id: "nf3",
      brand_id: brandId,
      source_page_id: "sp3",
      url: `https://${mockBrands[0].primary_domain}/features`,
      page_type: "product",
      title: "Core features",
      summary: "Real-time dashboards, SQL access, and integrations.",
    },
  ];
}

function mockExport(brandId: string): RankedTriggersExport {
  return {
    brand_id: brandId,
    batch_run_id: "mock-batch",
    scoring_config_version: "1.0.0",
    generated_at: new Date().toISOString(),
    triggers: [
      {
        trigger_candidate_id: "t1",
        brand_id: brandId,
        batch_run_id: "mock-batch",
        phrase: "product analytics",
        phrase_type: "bigram",
        intent_bucket: "commercial_investigation",
        appearance_count: 12,
        appearance_rate: 0.4,
        trigger_score: 0.82,
        recommended_action: "prioritize",
        source_page_ids: ["sp1", "sp3"],
        prompt_run_ids: ["pr1", "pr2"],
      },
      {
        trigger_candidate_id: "t2",
        brand_id: brandId,
        batch_run_id: "mock-batch",
        phrase: "funnel analysis tool",
        phrase_type: "keyphrase",
        intent_bucket: "transactional",
        appearance_count: 9,
        appearance_rate: 0.3,
        trigger_score: 0.76,
        recommended_action: "test",
        source_page_ids: ["sp3"],
        prompt_run_ids: ["pr3"],
      },
      {
        trigger_candidate_id: "t3",
        brand_id: brandId,
        batch_run_id: "mock-batch",
        phrase: "mixpanel alternative",
        phrase_type: "keyphrase",
        intent_bucket: "comparison",
        appearance_count: 7,
        appearance_rate: 0.23,
        trigger_score: 0.71,
        recommended_action: "prioritize",
        source_page_ids: ["sp1"],
        prompt_run_ids: ["pr4"],
      },
      {
        trigger_candidate_id: "t4",
        brand_id: brandId,
        batch_run_id: "mock-batch",
        phrase: "cohort retention",
        phrase_type: "bigram",
        intent_bucket: "informational",
        appearance_count: 6,
        appearance_rate: 0.2,
        trigger_score: 0.65,
        recommended_action: "monitor",
        source_page_ids: ["sp3"],
        prompt_run_ids: ["pr5"],
      },
      {
        trigger_candidate_id: "t5",
        brand_id: brandId,
        batch_run_id: "mock-batch",
        phrase: "startup analytics pricing",
        phrase_type: "keyphrase",
        intent_bucket: "commercial_investigation",
        appearance_count: 5,
        appearance_rate: 0.17,
        trigger_score: 0.58,
        recommended_action: "test",
        source_page_ids: ["sp2"],
        prompt_run_ids: ["pr6"],
      },
    ],
  };
}
