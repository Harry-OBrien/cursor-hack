import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "ghost" | "coral-outline" | "launch" | "default";

const variantClass: Record<Variant, string> = {
  primary: "btn btn--primary",
  ghost: "btn btn--ghost",
  "coral-outline": "btn btn--coral-outline",
  launch: "btn btn--launch",
  default: "btn",
};

export function Button({
  variant = "default",
  size,
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm";
  children: ReactNode;
}) {
  const cls = [
    variantClass[variant],
    size === "sm" ? "btn--sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  to,
  variant = "default",
  size,
  children,
  className = "",
}: {
  to: string;
  variant?: Variant;
  size?: "sm";
  children: ReactNode;
  className?: string;
}) {
  const cls = [
    variantClass[variant],
    size === "sm" ? "btn--sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}
