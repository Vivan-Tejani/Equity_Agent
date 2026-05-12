export default function SourceCard({ source }) {
  // Try to use meaningful data from source, fallback to generic for demo if missing
  const title = "Quarterly Financial Report FY2024"; 
  const subtitle = "Federal Reserve Economic Data Mar 2024";
  const progress = source.relevance ? Math.round(source.relevance * 100) : 94; // fallback

  // You can adjust these depending on what `source` actually contains in your app
  const displayTitle = source.doc_type && source.company ? `${source.company} ${source.doc_type.replace('_', ' ')}` : title;
  const displaySubtitle = source.year ? `FY${source.year} - Page ${source.page_number}` : subtitle;
  const fileName = source.source_file || "Document";

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        transition: "border-color 0.15s, background-color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border-bright)";
        e.currentTarget.style.background = "var(--color-panel)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.background = "var(--color-surface)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {fileName}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.4 }}>
          {displayTitle}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
          {displaySubtitle}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
        <div style={{ flex: 1, height: 4, background: "var(--color-border)", borderRadius: 2 }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--color-text-secondary)", borderRadius: 2 }}></div>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-muted)" }}>
          {progress}%
        </span>
      </div>
    </div>
  );
}
