import type { ReactNode } from "react";

export function PageToolbar() {
  return (
    <div className="page-toolbar">
      <button type="button" className="page-toolbar__clear">
        Clear draft <span aria-hidden>×</span>
      </button>
      <button type="button" className="page-toolbar__save">
        Save as Draft
      </button>
    </div>
  );
}

export function CollapsibleSection({
  title,
  action,
  defaultOpen = true,
  children,
}: {
  title: string;
  action?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="section-card" open={defaultOpen}>
      <summary className="section-card__head">
        <span className="section-card__title">{title}</span>
        <span className="section-card__actions">
          {action}
          <span className="section-card__chevron" aria-hidden>
            ▾
          </span>
        </span>
      </summary>
      <div className="section-card__body">{children}</div>
    </details>
  );
}

export function FloatingInput({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <label className="float-field">
      <span className="float-field__label">{label}</span>
      {multiline ? (
        <textarea
          className="float-field__input float-field__input--area"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <input
          className="float-field__input"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </label>
  );
}
