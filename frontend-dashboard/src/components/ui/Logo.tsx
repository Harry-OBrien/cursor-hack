export const PROJECT_NAME = "white space";

const LOGO_SRC = "/white-space.png";

export function Logo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={LOGO_SRC}
      alt={PROJECT_NAME}
      className={`logo ${className}`.trim()}
      width={size}
      height={size}
      decoding="async"
    />
  );
}
