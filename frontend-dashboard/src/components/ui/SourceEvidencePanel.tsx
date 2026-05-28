export function SourceEvidencePanel({
  sourcePageIds,
  promptRunIds,
}: {
  sourcePageIds: string[];
  promptRunIds: string[];
}) {
  return (
    <div className="card">
      <h3>Evidence</h3>
      <p>
        <strong>Source pages:</strong> {sourcePageIds.length || "—"}
      </p>
      <ul>
        {sourcePageIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
      <p>
        <strong>Prompt runs:</strong> {promptRunIds.length || "—"}
      </p>
      <ul>
        {promptRunIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  );
}
