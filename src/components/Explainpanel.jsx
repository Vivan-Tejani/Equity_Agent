import { useState } from "react";

const CONFIDENCE_STYLES = {
  high:   "status-high",
  medium: "status-medium",
  low:    "status-low",
};

export default function ExplainPanel({ explainability }) {
  const [open, setOpen] = useState(false);

  if (!explainability) return null;

  // ── Handle backend shape ──────────────────────────────────────────
  // Backend returns: avg_score, confidence (string), top_chunks[]{text, metadata, score}, contributions
  const {
    avg_score,
    confidence = "medium",
    top_chunks = [],
    contributions = {},
  } = explainability;

  const confClass = CONFIDENCE_STYLES[confidence.toLowerCase()] || "status-medium";

  // Build contributions bar
  const totalChunks = Object.values(contributions).reduce((a, b) => a + b, 0);
  const contribEntries = Object.entries(contributions).sort((a, b) => b[1] - a[1]);

  const BAR_COLORS = [
    "var(--color-amber)",
    "#60A5FA",
    "#4ADE80",
    "#C084FC",
    "#F87171",
  ];

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        marginTop: 16,
      }}
    >
      {/* ── Header (always visible) ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "var(--color-panel)",
          border: "none",
          padding: "11px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          borderBottom: open ? "1px solid var(--color-border)" : "none",
        }}
      >
        {/* Chevron */}
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-text-muted)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-text-secondary)",
            letterSpacing: "0.04em",
          }}
        >
          How was this answer generated?
        </span>

        {/* Confidence badge */}
        <span
          className={`badge ${confClass}`}
          style={{ marginLeft: "auto", fontSize: 9, textTransform: "uppercase" }}
        >
          {confidence} confidence
        </span>

        {/* Avg score */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-text-muted)",
            marginLeft: 10,
          }}
        >
          {avg_score?.toFixed(3)}
        </span>
      </button>

      {/* ── Expandable body ── */}
      {open && (
        <div
          style={{
            background: "var(--color-surface)",
            padding: "16px",
            animation: "fadeIn 0.2s ease forwards",
          }}
        >
          {/* Contributions bar */}
          {contribEntries.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <span className="section-label" style={{ display: "block", marginBottom: 10 }}>
                Source contributions
              </span>

              <div
                style={{
                  display: "flex",
                  height: 6,
                  borderRadius: 3,
                  overflow: "hidden",
                  marginBottom: 10,
                  gap: 2,
                }}
              >
                {contribEntries.map(([key, count], i) => (
                  <div
                    key={key}
                    style={{
                      height: "100%",
                      width: `${(count / totalChunks) * 100}%`,
                      background: BAR_COLORS[i % BAR_COLORS.length],
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>

              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
                {contribEntries.map(([key, count], i) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 8, height: 8, borderRadius: 2,
                        background: BAR_COLORS[i % BAR_COLORS.length],
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-secondary)" }}>
                      {key}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>
                      {count} chunk{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top chunks */}
          {top_chunks.length > 0 && (
            <div>
              <span className="section-label" style={{ display: "block", marginBottom: 10 }}>
                Top retrieved chunks
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {top_chunks.map((chunk, i) => (
                  <ChunkCard key={i} chunk={chunk} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChunkCard({ chunk, index }) {
  const [expanded, setExpanded] = useState(false);

  // Backend shape: { text, score, metadata: { company, doc_type, year, page_number } }
  const { text, score, metadata = {} } = chunk;
  const { company, doc_type, year, page_number } = metadata;

  const pct = Math.min(100, Math.max(0, (score || 0) * 100));

  return (
    <div
      style={{
        background: "var(--color-panel)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--color-amber)", fontWeight: 600, minWidth: 16,
          }}
        >
          #{index + 1}
        </span>

        {/* Score bar */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              flex: 1, height: 4,
              background: "var(--color-border)",
              borderRadius: 2, overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: pct >= 75 ? "var(--color-green)" : pct >= 55 ? "var(--color-yellow)" : "var(--color-red)",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              color: "var(--color-text-secondary)", minWidth: 36,
            }}
          >
            {score?.toFixed(3)}
          </span>
        </div>

        {/* Metadata */}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-muted)" }}>
          {company} · {doc_type} · {year}{page_number != null ? ` · pg ${page_number}` : ""}
        </span>
      </div>

      {/* Text preview */}
      <p
        style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--color-text-muted)", lineHeight: 1.6,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 3,
          WebkitBoxOrient: "vertical",
          marginBottom: 6,
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </p>

      {text?.length > 200 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--color-amber)", padding: 0, letterSpacing: "0.04em",
          }}
        >
          {expanded ? "Show less ↑" : "Show more ↓"}
        </button>
      )}
    </div>
  );
}