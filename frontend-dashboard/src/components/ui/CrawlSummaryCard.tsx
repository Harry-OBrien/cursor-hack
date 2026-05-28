export function CrawlSummaryCard({
  pages,
  facts,
}: {
  pages: number;
  facts: number;
}) {
  return (
    <div className="stat-row">
      <div className="stat-card">
        <div className="stat-card__value">{pages}</div>
        <div className="stat-card__label">Source pages</div>
      </div>
      <div className="stat-card">
        <div className="stat-card__value">{facts}</div>
        <div className="stat-card__label">Normalized facts</div>
      </div>
    </div>
  );
}
