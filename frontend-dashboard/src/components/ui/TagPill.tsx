export function TagPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <span className="tag-pill">
      {label}
      {onRemove && (
        <button
          type="button"
          className="tag-pill__remove"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
