import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { SourceEvidencePanel } from "../components/ui/SourceEvidencePanel";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/StatusBadge";
import { PageToolbar } from "../components/ui/WorkflowChrome";
import { WorkflowFooter } from "../components/ui/WorkflowFooter";
import type { TriggerCandidate, TriggerDecisionType } from "../types/contracts";

export function TriggerDetailPage() {
  const { brandId = "", triggerId = "" } = useParams();
  const [trigger, setTrigger] = useState<TriggerCandidate | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    api.getTriggers(brandId).then((exp) => {
      setTrigger(exp.triggers.find((t) => t.trigger_candidate_id === triggerId) ?? null);
    });
  }, [brandId, triggerId]);

  const decide = async (decision: TriggerDecisionType) => {
    if (!trigger) return;
    await api.saveDecision({
      trigger_decision_id: crypto.randomUUID(),
      trigger_candidate_id: trigger.trigger_candidate_id,
      brand_id: brandId,
      decision,
      decided_at: new Date().toISOString(),
    });
    setSaved(decision);
  };

  if (!trigger) return <p className="empty-state">Loading trigger…</p>;

  return (
    <div className="workflow-page">
      <PageToolbar />

      <div className="detail-header">
        <div>
          <p className="detail-header__eyebrow">Trigger review</p>
          <h1 className="detail-header__title">{trigger.phrase}</h1>
        </div>
        <StatusBadge label={trigger.recommended_action} />
      </div>

      {saved && (
        <div className="alert alert--info">Saved: {saved.replace(/_/g, " ")}</div>
      )}

      <div className="section-card section-card--static">
        <h2 className="section-card__title">Scores</h2>
        <div className="section-card__body">
          <p>
            Score <strong>{trigger.trigger_score.toFixed(2)}</strong> · Intent{" "}
            {trigger.intent_bucket.replace(/_/g, " ")} · {trigger.appearance_count}{" "}
            appearances
          </p>
          <div className="score-bar score-bar--wide">
            <div
              className="score-bar__fill"
              style={{ width: `${Math.min(100, trigger.trigger_score * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <SourceEvidencePanel
        sourcePageIds={trigger.source_page_ids ?? []}
        promptRunIds={trigger.prompt_run_ids ?? []}
      />

      <div className="section-card section-card--static">
        <h2 className="section-card__title">Review decision</h2>
        <div className="section-card__body btn-row">
          <Button variant="primary" onClick={() => decide("approve")}>
            Approve
          </Button>
          <Button variant="ghost" onClick={() => decide("reject")}>
            Reject
          </Button>
          <Button variant="coral-outline" onClick={() => decide("too_broad")}>
            Too broad
          </Button>
          <Button variant="coral-outline" onClick={() => decide("mark_for_testing")}>
            Mark for testing
          </Button>
        </div>
      </div>

      <WorkflowFooter backTo={`/brands/${brandId}/triggers`} />
    </div>
  );
}
