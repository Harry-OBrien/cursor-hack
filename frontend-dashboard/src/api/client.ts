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
      ? Promise.resolve([])
      : get<NormalizedFact[]>(`${ingestionBase}/brands/${brandId}/facts`),

  getSourcePages: (brandId: string) =>
    useMock
      ? Promise.resolve([])
      : get<SourcePage[]>(`${ingestionBase}/brands/${brandId}/source-pages`),

  getTriggers: (brandId: string) =>
    useMock
      ? Promise.resolve(mockExport(brandId))
      : get<RankedTriggersExport>(
          `${analysisBase}/brands/${brandId}/triggers`
        ),

  saveDecision: async (decision: TriggerDecision) => {
    // MVP: localStorage; later POST to backend
    const key = `decisions:${decision.brand_id}`;
    const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
    existing.push(decision);
    localStorage.setItem(key, JSON.stringify(existing));
  },
};

const mockBrands: Brand[] = [
  {
    brand_id: "00000000-0000-4000-8000-000000000001",
    name: "Acme Analytics",
    primary_domain: "acme-analytics.example",
    competitor_domains: [],
    seed_topics: [],
    created_at: "2026-05-28T12:00:00Z",
  },
];

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
      },
    ],
  };
}
