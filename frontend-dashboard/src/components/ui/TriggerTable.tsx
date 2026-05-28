import { Link } from "react-router-dom";
import type { TriggerCandidate } from "../../types/contracts";
import { StatusBadge } from "./StatusBadge";

export function TriggerTable({
  brandId,
  triggers,
}: {
  brandId: string;
  triggers: TriggerCandidate[];
}) {
  if (!triggers.length) {
    return (
      <div className="section-card section-card--static">
        <p className="empty-state">No triggers yet. Run analysis to populate.</p>
      </div>
    );
  }

  return (
    <div className="section-card section-card--static">
      <h2 className="section-card__title">Ranked triggers</h2>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Phrase</th>
              <th>Score</th>
              <th>Intent</th>
              <th>Action</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {triggers.map((t) => (
              <tr key={t.trigger_candidate_id}>
                <td>
                  <strong>{t.phrase}</strong>
                  <br />
                  <StatusBadge label={t.phrase_type} tone="mint" />
                </td>
                <td>{t.trigger_score.toFixed(2)}</td>
                <td>{t.intent_bucket.replace(/_/g, " ")}</td>
                <td>
                  <StatusBadge label={t.recommended_action} />
                </td>
                <td>
                  <Link
                    className="data-table__link"
                    to={`/brands/${brandId}/triggers/${t.trigger_candidate_id}`}
                  >
                    Review →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
