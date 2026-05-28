import type { ReactNode } from "react";

const PREVIEW_TABS = ["💬", "🖼", "✦", "☰"];

export function PreviewPanel({
  title = "Campaign preview",
  children,
}: {
  title?: string;
  children: ReactNode;
  adTitle?: string;
  triggerPhrase?: string;
}) {
  return (
    <aside className="preview-panel">
      <h2 className="preview-panel__title">{title}</h2>
      <div className="preview-panel__tabs" role="tablist">
        {PREVIEW_TABS.map((icon, i) => (
          <button
            key={icon}
            type="button"
            className={`preview-panel__tab${i === 0 ? " preview-panel__tab--active" : ""}`}
            aria-label={`Preview mode ${i + 1}`}
          >
            {icon}
          </button>
        ))}
      </div>
      {children}
      <button type="button" className="preview-panel__only">
        + Preview only
      </button>
    </aside>
  );
}

export function PhoneMockPreview({
  userPrompt,
  triggerPhrase,
  adTitle,
}: {
  userPrompt?: string;
  triggerPhrase?: string;
  adTitle?: string;
}) {
  return (
    <div className="phone-mock">
      <div className="phone-mock__notch" />
      <div className="phone-mock__screen">
        <div className="phone-mock__bubble phone-mock__bubble--user">
          {userPrompt ??
            "I've been looking for ways to improve our product analytics — any suggestions?"}
        </div>
        <p className="phone-mock__reply">
          Start by identifying what metrics matter most, then look for tools that
          streamline funnel and cohort analysis.
        </p>
        <div className="phone-mock__ad">
          <div className="phone-mock__ad-head">
            <span className="phone-mock__ad-logo" />
            <span className="phone-mock__ad-label">Ad</span>
          </div>
          <strong className="phone-mock__ad-title">
            {adTitle ?? triggerPhrase ?? "Your brand"}
          </strong>
          <p className="phone-mock__ad-desc">
            {triggerPhrase
              ? `High-intent trigger: “${triggerPhrase}” — surfaced from prompt simulation.`
              : "Trigger phrases will appear here after analysis completes."}
          </p>
        </div>
        <div className="phone-mock__pager">
          <button type="button" aria-label="Previous">
            ‹
          </button>
          <span>3 / 3</span>
          <button type="button" aria-label="Next">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
