export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "running" | "completed" | "failed" | "mint";
}) {
  return <span className={`badge badge--${tone}`}>{label}</span>;
}
