export default function AnswerBlock({ answer }) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderLeft: "3px solid var(--color-amber)",
        borderRadius: "var(--radius-md)",
        padding: "16px 18px",
        marginBottom: "16px",
        animation: "fadeIn 0.3s ease forwards",
      }}
    >
      <span className="section-label" style={{ display: "block", marginBottom: 10 }}>
        Answer
      </span>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "var(--color-text-primary)",
          lineHeight: 1.75,
          whiteSpace: "pre-wrap",
        }}
      >
        {answer}
      </p>
    </div>
  );
}