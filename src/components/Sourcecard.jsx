// Backend returns sources as: [{ company, doc_type, year, page_number, source_file, chunk_index, ... }]

const COMPANY_COLORS = {
  TCS:          { color: "#60A5FA", bg: "rgba(59,130,246,0.12)"  },
  Infosys:      { color: "#4ADE80", bg: "rgba(34,197,94,0.10)"   },
  Wipro:        { color: "#C084FC", bg: "rgba(168,85,247,0.12)"  },
  HCLTech:      { color: "#F5A623", bg: "rgba(245,166,35,0.10)"  },
  TechMahindra: { color: "#F87171", bg: "rgba(239,68,68,0.10)"   },
};

const DOC_TYPE_LABELS = {
  annual_report:       "Annual Report",
  quarterly_filing:    "Quarterly Filing",
  earnings_call:       "Earnings Call",
  screener_financials: "Financials",
};

export default function SourceCard({ source }) {
  // Backend: source = { company, doc_type, year, page_number, ... }
  const { company, doc_type, year, page_number } = source;
  const colors = COMPANY_COLORS[company] || { color: "var(--color-amber)", bg: "var(--color-amber-subtle)" };
  const docLabel = DOC_TYPE_LABELS[doc_type] || doc_type;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "10px 14px",
        minWidth: 165,
        flexShrink: 0,
        transition: "border-color 0.15s",
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-border-bright)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
    >
      {/* Company badge */}
      <span
        className="badge"
        style={{
          color: colors.color,
          background: colors.bg,
          marginBottom: 6,
          display: "inline-block",
        }}
      >
        {company}
      </span>

      {/* Doc type */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--color-text-secondary)",
          marginBottom: 3,
        }}
      >
        {docLabel}
      </p>

      {/* Year + page */}
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>
        {year}
        {page_number != null && (
          <span style={{ marginLeft: 8, color: "var(--color-text-faint)" }}>
            pg {page_number}
          </span>
        )}
      </p>
    </div>
  );
}