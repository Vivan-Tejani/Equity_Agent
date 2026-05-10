import { useState } from "react";
import api from "../api/client";
import QuestionForm from "../components/QuestionForm";
import AnswerBlock from "../components/AnswerBlock";
import SourceCard from "../components/SourceCard";
import ExplainPanel from "../components/ExplainPanel";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";

export default function QAPage() {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [result, setResult]     = useState(null);
  const [lastQuery, setLastQuery] = useState(null);

  async function handleSubmit({ question, company }) {
    setLoading(true);
    setError(null);
    setResult(null);
    setLastQuery({ question, company });

    try {
      const res = await api.post("/ask", { question, company });
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    if (lastQuery) handleSubmit(lastQuery);
  }

  return (
    <div className="fade-in" style={{ maxWidth: 860 }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 24 }}>
        <span className="section-label" style={{ color: "var(--color-amber)" }}>
          Natural Language Q&amp;A
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
          Ask the corpus
        </h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-text-muted)",
          }}
        >
          Every answer is cited to a specific document, page, and year — the
          LLM cannot draw from training memory.
        </p>
      </div>

      {/* ── Input form ── */}
      <QuestionForm onSubmit={handleSubmit} loading={loading} />

      {/* ── Loading skeletons ── */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SkeletonCard height={110} />
          <div style={{ display: "flex", gap: 10 }}>
            <SkeletonCard height={72} />
            <SkeletonCard height={72} />
            <SkeletonCard height={72} />
          </div>
          <SkeletonCard height={48} />
        </div>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <ErrorBanner message={error} onRetry={handleRetry} />
      )}

      {/* ── Results ── */}
      {!loading && result && (
        <div style={{ animation: "fadeIn 0.3s ease forwards" }}>

          {/* Answer */}
          <AnswerBlock answer={result.answer} />

          {/* Sources */}
          {result.sources?.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <span
                className="section-label"
                style={{ display: "block", marginBottom: 10 }}
              >
                Sources — {result.sources.length} citation
                {result.sources.length !== 1 ? "s" : ""}
              </span>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  overflowX: "auto",
                  paddingBottom: 6,
                }}
              >
                {result.sources.map((src, i) => (
                  <SourceCard key={i} source={src} />
                ))}
              </div>
            </div>
          )}

          {/* Explainability panel */}
          <ExplainPanel explainability={result.explainability} />
        </div>
      )}

      {/* ── Empty state (no query yet) ── */}
      {!loading && !result && !error && (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  const EXAMPLES = [
    "What is TCS revenue growth in FY25?",
    "How did Infosys manage its operating margins in Q3 FY25?",
    "What did Wipro management say about deal wins in the last earnings call?",
    "Compare HCLTech and TechMahindra debt levels.",
  ];

  return (
    <div
      style={{
        marginTop: 8,
        border: "1px dashed var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "28px 24px",
      }}
    >
      <span className="section-label" style={{ display: "block", marginBottom: 14 }}>
        Example questions
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {EXAMPLES.map((q) => (
          <button
            key={q}
            onClick={() => {
              const el = document.getElementById("question-input");
              if (el) {
                el.value = q;
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
                el.focus();
              }
            }}
            style={{
              background: "var(--color-panel)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 14px",
              textAlign: "left",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-text-secondary)",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-amber)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            → {q}
          </button>
        ))}
      </div>
    </div>
  );
}