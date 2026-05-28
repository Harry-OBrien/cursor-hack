export function SourceEvidencePanel({
  sourcePageIds,
  promptRunIds,
}: {
  sourcePageIds: string[];
  promptRunIds: string[];
}) {
  return (
    <div className="section-card section-card--static">
      <h2 className="section-card__title">Source evidence</h2>
      <div className="section-card__body">
        <p>
          <strong>Source pages</strong> ({sourcePageIds.length})
        </p>
        {sourcePageIds.length ? (
          <ul className="evidence-list">
            {sourcePageIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "var(--text-faint)", fontSize: "0.82rem" }}>No linked pages.</p>
        )}
        <p style={{ marginTop: "1rem" }}>
          <strong>Prompt runs</strong> ({promptRunIds.length})
        </p>
        {promptRunIds.length ? (
          <ul className="evidence-list">
            {promptRunIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "var(--text-faint)", fontSize: "0.82rem" }}>No linked runs.</p>
        )}
      </div>
    </div>
  );
}
