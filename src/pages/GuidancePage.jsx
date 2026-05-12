import { useState, useEffect } from "react";
import api from "../api/client";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

const COMPANIES = ["TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"];

const DOC_TYPE_LABELS = {
  annual_report:    "Annual Report",
  quarterly_filing: "Quarterly Filing",
  earnings_call:    "Earnings Call",
};

export default function GuidancePage() {
  const [selected, setSelected] = useState("TCS");
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => { fetchGuidance(selected); }, [selected]);

  async function fetchGuidance(company) {
    setLoading(true); setError(null); setData([]);
    try {
      const res = await api.get(`/guidance/${company}`);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const promises   = data.filter((d) => d.type === "promise");
  const deliveries = data.filter((d) => d.type === "delivery");

  return (
    <div className="page-shell">
      <div className="page-content fade-in">

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <span className="section-label" style={{ color: "var(--color-amber)" }}>
          Management Guidance Tracker
        </span>
        <h1 style={{
          fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500,
          color: "var(--color-text-primary)", marginTop: 5, marginBottom: 4,
        }}>
          Promises vs Deliveries
        </h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-muted)" }}>
          What management said · what actually happened · sourced from earnings calls and filings
        </p>
      </div>

      {/* ── Company selector ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {COMPANIES.map((c) => (
          <button key={c} onClick={() => setSelected(c)} style={{
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.06em", padding: "5px 14px", borderRadius: 3,
            border: "1px solid", cursor: "pointer", transition: "all 0.12s",
            borderColor: selected === c ? "var(--color-amber)" : "var(--color-border)",
            background:  selected === c ? "var(--color-amber-subtle)" : "transparent",
            color:       selected === c ? "var(--color-amber)" : "var(--color-text-secondary)",
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* ── Error ── */}
      {!loading && error && (
        <ErrorBanner message={error} onRetry={() => fetchGuidance(selected)} />
      )}

      {/* ── Loading ── */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SkeletonCard height={24} />
            <SkeletonCard height={110} />
            <SkeletonCard height={110} />
            <SkeletonCard height={110} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SkeletonCard height={24} />
            <SkeletonCard height={110} />
            <SkeletonCard height={110} />
            <SkeletonCard height={110} />
          </div>
        </div>
      )}

      {/* ── Two-column layout ── */}
      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Promises column */}
          <div>
            <ColumnHeader
              icon={<FlagIcon />}
              label="What Was Promised"
              count={promises.length}
              color="var(--color-amber)"
            />
            {promises.length === 0
              ? <EmptyColumn label="No promises tracked yet" />
              : promises.map((item, i) => (
                  <GuidanceCard key={i} item={item} type="promise" />
                ))
            }
          </div>

          {/* Deliveries column */}
          <div>
            <ColumnHeader
              icon={<CheckIcon />}
              label="What Was Delivered"
              count={deliveries.length}
              color="var(--color-green)"
            />
            {deliveries.length === 0
              ? <EmptyColumn label="No deliveries tracked yet" />
              : deliveries.map((item, i) => (
                  <GuidanceCard key={i} item={item} type="delivery" />
                ))
            }
          </div>

        </div>
      )}
      </div>
    </div>
  );
}

// ── Column header ─────────────────────────────────────────────────────────────
function ColumnHeader({ icon, label, count, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      marginBottom: 12, paddingBottom: 10,
      borderBottom: "1px solid var(--color-border)",
    }}>
      <span style={{ color, display: "flex" }}>{icon}</span>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "var(--color-text-secondary)",
      }}>
        {label}
      </span>
      {count > 0 && (
        <span style={{
          marginLeft: "auto",
          fontFamily: "var(--font-mono)", fontSize: 9,
          color, background: color === "var(--color-amber)"
            ? "var(--color-amber-subtle)"
            : "var(--color-green-subtle)",
          padding: "2px 7px", borderRadius: 2,
        }}>
          {count}
        </span>
      )}
    </div>
  );
}

// ── Guidance card ─────────────────────────────────────────────────────────────
function GuidanceCard({ item, type }) {
  const [expanded, setExpanded] = useState(false);
  const { text, doc_type, year, page_number, company } = item;
  const isPromise = type === "promise";
  const accentColor = isPromise ? "var(--color-amber)" : "var(--color-green)";
  const docLabel = DOC_TYPE_LABELS[doc_type] || doc_type;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
        marginBottom: 10,
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-border-bright)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
    >
      {/* Quote text */}
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: 13,
        color: "var(--color-text-primary)", lineHeight: 1.65,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: expanded ? "unset" : 4,
        WebkitBoxOrient: "vertical",
        marginBottom: text?.length > 200 ? 6 : 10,
      }}>
        {isPromise && (
          <span style={{ color: accentColor, marginRight: 4 }}>"</span>
        )}
        {text}
        {isPromise && (
          <span style={{ color: accentColor }}>"</span>
        )}
      </p>

      {/* Show more toggle */}
      {text?.length > 200 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: accentColor, padding: 0,
            letterSpacing: "0.04em", marginBottom: 8,
          }}
        >
          {expanded ? "Show less ↑" : "Show more ↓"}
        </button>
      )}

      {/* Citation footer */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        paddingTop: 8, borderTop: "1px solid var(--color-border)",
        flexWrap: "wrap",
      }}>
        {/* Company badge */}
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase",
          color: accentColor,
          background: isPromise ? "var(--color-amber-subtle)" : "var(--color-green-subtle)",
          padding: "2px 6px", borderRadius: 2,
        }}>
          {company}
        </span>

        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>
          {docLabel}
        </span>

        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>
          {year}
        </span>

        {page_number != null && (
          <span style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--color-text-faint)",
          }}>
            pg {page_number}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Empty column state ────────────────────────────────────────────────────────
function EmptyColumn({ label }) {
  return (
    <div style={{
      border: "1px dashed var(--color-border)",
      borderRadius: "var(--radius-md)",
      padding: "32px 20px",
      textAlign: "center",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--color-text-muted)",
      }}>
        {label}
      </p>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function FlagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}