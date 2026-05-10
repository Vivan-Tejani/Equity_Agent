export default function ScorecardPage() {
  return (
    <div className="fade-in">
      <span className="section-label" style={{ color: "var(--color-amber)" }}>
        Financial Scorecard
      </span>
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 22,
          fontWeight: 500,
          color: "var(--color-text-primary)",
          marginTop: 6,
          marginBottom: 4,
        }}
      >
        Company metrics at a glance
      </h1>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-muted)" }}>
        Phase 3 — coming soon
      </p>
    </div>
  );
}