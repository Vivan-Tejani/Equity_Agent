import { useState, useEffect } from "react";
import api from "../api/client";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

const COMPANIES = ["TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"];

function getMetricColor(metric, value) {
  const v = parseFloat(value);
  const rules = {
    revenue_growth:    { green: 10,  yellow: 5,   reverse: false },
    net_profit_margin: { green: 20,  yellow: 10,  reverse: false },
    roe:               { green: 20,  yellow: 10,  reverse: false },
    debt_to_equity:    { green: 0.5, yellow: 1.0, reverse: true  },
  };
  const r = rules[metric];
  if (!r) return { color: "var(--color-text-primary)", bg: "transparent" };
  const tier = r.reverse
    ? (v <= r.green ? "green" : v <= r.yellow ? "yellow" : "red")
    : (v >= r.green ? "green" : v >= r.yellow ? "yellow" : "red");
  return {
    green:  { color: "var(--color-green)",  bg: "var(--color-green-subtle)"  },
    yellow: { color: "var(--color-yellow)", bg: "var(--color-yellow-subtle)" },
    red:    { color: "var(--color-red)",    bg: "var(--color-red-subtle)"    },
  }[tier];
}

function getScoreColor(score) {
  if (score >= 75) return "var(--color-green)";
  if (score >= 50) return "var(--color-yellow)";
  return "var(--color-red)";
}

const METRIC_CONFIG = [
  {
    key: "revenue_growth",
    label: "Revenue Growth",
    unit: "%",
    description: "YoY revenue growth",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  },
  {
    key: "net_profit_margin",
    label: "Net Profit Margin",
    unit: "%",
    description: "Net profit as % of revenue",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    key: "roe",
    label: "Return on Equity",
    unit: "%",
    description: "Net income / shareholders equity",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  },
  {
    key: "debt_to_equity",
    label: "Debt / Equity",
    unit: "x",
    description: "Total debt / shareholders equity",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  },
];

export default function ScorecardPage() {
  const [selected, setSelected] = useState("TCS");
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => { fetchScorecard(selected); }, [selected]);

  async function fetchScorecard(company) {
    setLoading(true); setError(null); setData(null);
    try {
      const res = await api.get(`/scorecard/${company}`);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-in" style={{ maxWidth: 780 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <span className="section-label" style={{ color: "var(--color-amber)" }}>Financial Scorecard</span>
        <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)", marginTop: 5, marginBottom: 4 }}>
          Company metrics at a glance
        </h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-muted)" }}>
          Sourced from Screener.in exports · FY25
        </p>
      </div>

      {/* Company selector */}
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

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <SkeletonCard height={130} /><SkeletonCard height={130} />
            <SkeletonCard height={130} /><SkeletonCard height={130} />
          </div>
          <SkeletonCard height={90} />
        </div>
      )}

      {/* Error */}
      {!loading && error && <ErrorBanner message={error} onRetry={() => fetchScorecard(selected)} />}

      {/* Data */}
      {!loading && data && (
        <div className="fade-in">

          {/* Company + score strip */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16, padding: "10px 16px",
            background: "var(--color-panel)", border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "0.06em" }}>
              {data.company}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>Financial Score</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: getScoreColor(data.financial_score) }}>
                {data.financial_score}
                <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 400 }}> / 100</span>
              </span>
            </div>
          </div>

          {/* 2x2 metric grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {METRIC_CONFIG.map((m) => {
              const value  = data.metrics?.[m.key];
              const colors = getMetricColor(m.key, value);
              return <MetricCard key={m.key} config={m} value={value} colors={colors} />;
            })}
          </div>

          {/* Score bar */}
          <ScoreBar score={data.financial_score} />
        </div>
      )}
    </div>
  );
}

function MetricCard({ config, value, colors }) {
  const display = value != null ? parseFloat(value).toFixed(1) : "—";
  return (
    <div
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "18px 20px", position: "relative", overflow: "hidden", transition: "border-color 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-border-bright)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
    >
      <div style={{ position: "absolute", inset: 0, background: colors.bg, opacity: 0.35, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, position: "relative" }}>
        <span style={{ color: colors.color, display: "flex" }}>{config.icon}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
          {config.label}
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 700, color: colors.color, lineHeight: 1 }}>{display}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--color-text-muted)", marginLeft: 3 }}>{config.unit}</span>
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-muted)", marginTop: 8, position: "relative" }}>
        {config.description}
      </p>
    </div>
  );
}

function ScoreBar({ score }) {
  const color = getScoreColor(score);
  const pct   = Math.min(100, Math.max(0, score));
  const label = score >= 75 ? "Strong" : score >= 50 ? "Moderate" : "Weak";
  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", display: "block", marginBottom: 4 }}>
            Overall Financial Score
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color }}>{label}</span>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color }}>
          {score}<span style={{ fontSize: 13, color: "var(--color-text-muted)", fontWeight: 400 }}> / 100</span>
        </span>
      </div>
      <div style={{ height: 6, background: "var(--color-border)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-faint)" }}>{tick}</span>
        ))}
      </div>
    </div>
  );
}