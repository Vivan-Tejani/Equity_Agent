import { useState, useEffect } from "react";
import api from "../api/client";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

function getCellStyle(metric, value) {
  const v = parseFloat(value);
  if (isNaN(v)) return {};
  const rules = {
    revenue_growth:    { green: 10,  yellow: 5,   reverse: false },
    net_profit_margin: { green: 20,  yellow: 10,  reverse: false },
    roe:               { green: 20,  yellow: 10,  reverse: false },
    debt_to_equity:    { green: 0.5, yellow: 1.0, reverse: true  },
    financial_score:   { green: 75,  yellow: 50,  reverse: false },
  };
  const r = rules[metric];
  if (!r) return {};
  const tier = r.reverse
    ? (v <= r.green ? "green" : v <= r.yellow ? "yellow" : "red")
    : (v >= r.green ? "green" : v >= r.yellow ? "yellow" : "red");
  return {
    green:  { color: "var(--color-green)",  background: "var(--color-green-subtle)"  },
    yellow: { color: "var(--color-yellow)", background: "var(--color-yellow-subtle)" },
    red:    { color: "var(--color-red)",    background: "var(--color-red-subtle)"    },
  }[tier];
}

// Find best value index for each metric column
function getBestIndex(rows, metric, reverse = false) {
  if (!rows.length) return -1;
  const values = rows.map((r) => parseFloat(r[metric]));
  const valid  = values.filter((v) => !isNaN(v));
  if (!valid.length) return -1;
  const best = reverse ? Math.min(...valid) : Math.max(...valid);
  return values.indexOf(best);
}

const COLUMNS = [
  { key: "revenue_growth",    label: "Rev Growth",   unit: "%",  reverse: false },
  { key: "net_profit_margin", label: "Net Margin",   unit: "%",  reverse: false },
  { key: "roe",               label: "ROE",          unit: "%",  reverse: false },
  { key: "debt_to_equity",    label: "D / E",        unit: "x",  reverse: true  },
  { key: "financial_score",   label: "Score",        unit: "",   reverse: false },
];

const COMPANY_COLORS = {
  TCS:          { color: "#60A5FA", bg: "rgba(59,130,246,0.12)"  },
  Infosys:      { color: "#4ADE80", bg: "rgba(34,197,94,0.10)"   },
  Wipro:        { color: "#C084FC", bg: "rgba(168,85,247,0.12)"  },
  HCLTech:      { color: "#F5A623", bg: "rgba(245,166,35,0.10)"  },
  TechMahindra: { color: "#F87171", bg: "rgba(239,68,68,0.10)"   },
};

export default function ComparisonPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => { fetchComparison(); }, []);

  async function fetchComparison() {
    setLoading(true); setError(null); setData([]);
    try {
      const res = await api.get("/comparison");
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Pre-compute best index per column
  const bestIdx = {};
  COLUMNS.forEach((col) => {
    bestIdx[col.key] = getBestIndex(data, col.key, col.reverse);
  });

  return (
    <div className="page-shell">
      <div className="page-content-wide fade-in">

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <span className="section-label" style={{ color: "var(--color-amber)" }}>
          Cross-Company Comparison
        </span>
        <h1 style={{
          fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500,
          color: "var(--color-text-primary)", marginTop: 5, marginBottom: 4,
        }}>
          Indian IT — Side by side
        </h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-muted)" }}>
          FY25 · color coded by performance · ★ marks best in class per metric
        </p>
      </div>

      {/* ── Error ── */}
      {!loading && error && (
        <ErrorBanner message={error} onRetry={fetchComparison} />
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SkeletonCard height={40} />
          {[1,2,3,4,5].map((i) => <SkeletonCard key={i} height={56} />)}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && data.length > 0 && (
        <div
          className="fade-in"
          style={{ overflowX: "auto", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>

            {/* Head */}
            <thead>
              <tr style={{ background: "var(--color-panel)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={thStyle({ textAlign: "left", width: 160 })}>Company</th>
                {COLUMNS.map((col) => (
                  <th key={col.key} style={thStyle({ textAlign: "right" })}>
                    {col.label}
                    {col.unit && (
                      <span style={{ color: "var(--color-text-faint)", marginLeft: 3 }}>
                        {col.unit}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {data.map((row, rowIdx) => {
                const company = COMPANY_COLORS[row.company] || { color: "var(--color-amber)", bg: "var(--color-amber-subtle)" };
                const isLast  = rowIdx === data.length - 1;
                return (
                  <tr
                    key={row.company}
                    style={{
                      borderBottom: isLast ? "none" : "1px solid var(--color-border)",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-panel)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Company name cell */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 3, height: 28, borderRadius: 2,
                          background: company.color, flexShrink: 0,
                        }} />
                        <div>
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: 12,
                            fontWeight: 700, color: "var(--color-text-primary)",
                            letterSpacing: "0.04em",
                          }}>
                            {row.company}
                          </span>
                          <span style={{
                            display: "block", fontFamily: "var(--font-mono)",
                            fontSize: 9, color: "var(--color-text-muted)",
                            marginTop: 2,
                          }}>
                            Indian IT
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Metric cells */}
                    {COLUMNS.map((col) => {
                      const value    = row[col.key];
                      const cellStyle = getCellStyle(col.key, value);
                      const isBest   = bestIdx[col.key] === rowIdx;
                      const display  = value != null ? parseFloat(value).toFixed(1) : "—";

                      return (
                        <td
                          key={col.key}
                          style={{
                            padding: "14px 16px",
                            textAlign: "right",
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            fontWeight: 600,
                            ...cellStyle,
                            position: "relative",
                          }}
                        >
                          {display}
                          {col.unit && display !== "—" && (
                            <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 2 }}>
                              {col.unit}
                            </span>
                          )}
                          {isBest && (
                            <span
                              title="Best in class"
                              style={{
                                marginLeft: 5,
                                fontSize: 10,
                                verticalAlign: "middle",
                              }}
                            >
                              ★
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Legend ── */}
      {!loading && data.length > 0 && (
        <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
          {[
            { color: "var(--color-green)",  bg: "var(--color-green-subtle)",  label: "Strong"   },
            { color: "var(--color-yellow)", bg: "var(--color-yellow-subtle)", label: "Moderate" },
            { color: "var(--color-red)",    bg: "var(--color-red-subtle)",    label: "Weak"     },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.bg, border: `1px solid ${l.color}` }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>
                {l.label}
              </span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11 }}>★</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>
              Best in class
            </span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// ── Table header cell style ───────────────────────────────────────────────────
function thStyle(overrides = {}) {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--color-text-muted)",
    padding: "12px 16px",
    whiteSpace: "nowrap",
    ...overrides,
  };
}