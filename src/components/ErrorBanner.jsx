export default function ErrorBanner({ message, onRetry }) {
  return (
    <div
      style={{
        background: "var(--color-red-subtle)",
        border: "1px solid var(--color-red)",
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      {/* Icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-red)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, marginTop: 1 }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--color-red)",
            lineHeight: 1.5,
          }}
        >
          {message || "Something went wrong. Please try again."}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-ghost"
          style={{
            flexShrink: 0,
            borderColor: "var(--color-red)",
            color: "var(--color-red)",
            fontSize: 11,
            padding: "4px 12px",
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}