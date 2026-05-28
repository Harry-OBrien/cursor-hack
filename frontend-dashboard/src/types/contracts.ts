/** TypeScript mirrors of shared/schemas — keep in sync with shared/ */

export type IntentBucket =
  | "informational"
  | "commercial_investigation"
  | "transactional"
  | "comparison"
  | "problem_solution"
  | "alternative_switching";

export interface Brand {
  brand_id: string;
  name: string;
  primary_domain: string;
  competitor_domains: string[];
  seed_topics: string[];
  created_at: string;
  updated_at?: string;
}

export interface SourcePage {
  source_page_id: string;
  brand_id: string;
  url: string;
  page_type: string;
  title?: string;
  last_crawled_at: string;
}

export interface NormalizedFact {
  normalized_fact_id: string;
  brand_id: string;
  source_page_id: string;
  url: string;
  page_type: string;
  title?: string;
  summary?: string;
  features?: string[];
  pain_points?: string[];
}

export interface TriggerCandidate {
  trigger_candidate_id: string;
  brand_id: string;
  batch_run_id: string;
  phrase: string;
  phrase_type: "unigram" | "bigram" | "keyphrase" | "entity";
  intent_bucket: string;
  appearance_count: number;
  appearance_rate: number;
  trigger_score: number;
  recommended_action: "prioritize" | "test" | "monitor" | "deprioritize";
  prompt_run_ids?: string[];
  source_page_ids?: string[];
  score_breakdown?: Record<string, number>;
}

export interface RankedTriggersExport {
  brand_id: string;
  batch_run_id: string;
  scoring_config_version: string;
  generated_at: string;
  triggers: TriggerCandidate[];
}

export type TriggerDecisionType =
  | "approve"
  | "reject"
  | "too_broad"
  | "mark_for_testing";

export interface TriggerDecision {
  trigger_decision_id: string;
  trigger_candidate_id: string;
  brand_id: string;
  decision: TriggerDecisionType;
  note?: string;
  decided_at: string;
}
