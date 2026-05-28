import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { NormalizedFact } from "../types/contracts";
import { PageToolbar } from "../components/ui/WorkflowChrome";
import { WorkflowFooter } from "../components/ui/WorkflowFooter";
import { StatusBadge } from "../components/ui/StatusBadge";

export function KnowledgePage() {
  const { brandId = "" } = useParams();
  const [facts, setFacts] = useState<NormalizedFact[]>([]);

  useEffect(() => {
    api.getFacts(brandId).then(setFacts);
  }, [brandId]);

  return (
    <div className="workflow-page">
      <PageToolbar />

      <div className="section-card section-card--static">
        <h2 className="section-card__title">Reference creatives</h2>
        {!facts.length ? (
          <p className="empty-state">No normalized facts yet. Run ingestion first.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Type</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {facts.map((f) => (
                  <tr key={f.normalized_fact_id}>
                    <td>
                      <a href={f.url} target="_blank" rel="noreferrer" className="data-table__link">
                        {f.title ?? f.url}
                      </a>
                    </td>
                    <td>
                      <StatusBadge label={f.page_type} tone="mint" />
                    </td>
                    <td className="data-table__desc">{f.summary ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <WorkflowFooter
        backTo={`/brands/${brandId}/triggers`}
        nextTo={`/brands/${brandId}/export`}
      />
    </div>
  );
}
