export default function SkeletonCard({ height = 80, className = "" }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        height,
        borderRadius: "var(--radius-md)",
        width: "100%",
      }}
    />
  );
}