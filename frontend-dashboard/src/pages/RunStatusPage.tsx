import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";

const PLACEHOLDER_RUNS = [
  {
    run_type: "ingestion",
    status: "completed" as const,
    started_at: "2026-05-28T10:00:00Z",
    stats: { pages: 24, facts: 18 },
  },
  {
    run_type: "analysis",
    status: "running" as const,
    started_at: "2026-05-28T11:30:00Z",
    stats: { prompts: 48 },
  },
];

export function RunStatusPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Pipeline"
        title="Run status"
        actions={<StatusBadge label="Live polling soon" tone="running" />}
      />

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Batch runs</h2>
          <span className="page-toolbar__link">Refresh</span>
        </div>
        <ul className="run-list">
          {PLACEHOLDER_RUNS.map((run, i) => (
            <li key={i} className="run-item">
              <StatusBadge
                label={run.status}
                tone={
                  run.status === "completed"
                    ? "completed"
                    : run.status === "running"
                      ? "running"
                      : "neutral"
                }
              />
              <div className="run-item__meta">
                <p className="run-item__type">{run.run_type}</p>
                <p className="run-item__time">
                  Started {new Date(run.started_at).toLocaleString()}
                </p>
                <p className="form-field__hint">
                  {Object.entries(run.stats)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="form-field__hint" style={{ marginTop: "1rem" }}>
          Will poll <code>batch_run.json</code> from ingestion and analysis APIs.
        </p>
      </div>
    </div>
  );
}
