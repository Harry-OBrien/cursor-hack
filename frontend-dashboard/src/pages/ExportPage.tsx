import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { TriggerCandidate } from "../types/contracts";
import { PageToolbar } from "../components/ui/WorkflowChrome";
import { TagPill } from "../components/ui/TagPill";

export function ExportPage() {
  const { brandId = "" } = useParams();
  const [shortlist, setShortlist] = useState<TriggerCandidate[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(`decisions:${brandId}`);
    const decisions = raw ? JSON.parse(raw) : [];
    const approved = new Set(
      decisions
        .filter((d: { decision: string }) =>
          ["approve", "mark_for_testing"].includes(d.decision)
        )
        .map((d: { trigger_candidate_id: string }) => d.trigger_candidate_id)
    );
    api.getTriggers(brandId).then((exp) =>
      setShortlist(exp.triggers.filter((t) => approved.has(t.trigger_candidate_id)))
    );
  }, [brandId]);

  const download = () => {
    const blob = new Blob([JSON.stringify(shortlist, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `triggers-${brandId}.json`;
    a.click();
  };

  return (
    <div className="workflow-page">
      <PageToolbar />

      <div className="section-card section-card--static">
        <h2 className="section-card__title">Budget & export</h2>
        <div className="section-card__body">
          <p>
            <strong>{shortlist.length}</strong> triggers approved for campaign testing.
          </p>
          {shortlist.length > 0 ? (
            <div className="tag-cloud" style={{ marginTop: "1rem" }}>
              {shortlist.map((t) => (
                <TagPill key={t.trigger_candidate_id} label={t.phrase} />
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-faint)", fontSize: "0.82rem", marginTop: "0.75rem" }}>
              Approve triggers on the detail page to build your shortlist.
            </p>
          )}
        </div>
      </div>

      <div className="workflow-footer">
        <div className="workflow-footer__left">
          <Link to={`/brands/${brandId}/knowledge`} className="workflow-footer__text">
            BACK
          </Link>
        </div>
        <div className="workflow-footer__right">
          <button type="button" className="btn btn--outline" onClick={download} disabled={!shortlist.length}>
            Save as Draft
          </button>
          <button type="button" className="btn btn--next" onClick={download} disabled={!shortlist.length}>
            Launch
          </button>
        </div>
      </div>
    </div>
  );
}
