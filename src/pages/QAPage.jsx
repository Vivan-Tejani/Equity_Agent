import { useState, useRef, useEffect } from "react";
import api from "../api/client";
import SourceCard from "../components/SourceCard";
import ExplainPanel from "../components/ExplainPanel";
import ErrorBanner from "../components/ErrorBanner";

const COMPANIES = ["All", "TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"];

const EXAMPLES = [
  "What is TCS revenue growth in FY25?",
  "How did Infosys manage its operating margins in Q3 FY25?",
  "What did Wipro management say about deal wins in the last earnings call?",
  "Compare HCLTech and TechMahindra debt levels.",
];

export default function QAPage() {
  const [messages, setMessages] = useState([]); // { role: "user"|"assistant", content, sources, explainability, error }
  const [question, setQuestion] = useState("");
  const [company, setCompany] = useState("All");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit() {
    const q = question.trim();
    if (!q || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: q, company }]);
    setQuestion("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const res = await api.post("/ask", { question: q, company });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer,
          sources: res.data.sources,
          explainability: res.data.explainability,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", error: err.message },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleExampleClick(q) {
    setQuestion(q);
    textareaRef.current?.focus();
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 48px)", // full height minus topbar
        maxWidth: 780,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* ── Page header ── */}
      <div style={{ padding: "20px 0 16px", flexShrink: 0 }}>
        <span className="section-label" style={{ color: "var(--color-amber)" }}>
          Natural Language Q&amp;A
        </span>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 20,
            fontWeight: 500,
            color: "var(--color-text-primary)",
            marginTop: 5,
          }}
        >
          Ask the corpus
        </h1>
      </div>

      {/* ── Chat thread ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Empty state */}
        {messages.length === 0 && !loading && (
          <div
            style={{
              border: "1px dashed var(--color-border-bright)",
              borderRadius: "var(--radius-md)",
              padding: "24px",
            }}
          >
            <span
              className="section-label"
              style={{ display: "block", marginBottom: 12, color: "var(--color-text-secondary)" }}
            >
              Example questions
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {EXAMPLES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleExampleClick(q)}
                  style={{
                    background: "var(--color-panel)",
                    border: "1px solid var(--color-border-bright)",
                    borderRadius: "var(--radius-sm)",
                    padding: "10px 14px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--color-text-primary)",  // bright text
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-amber)";
                    e.currentTarget.style.background = "var(--color-amber-subtle)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border-bright)";
                    e.currentTarget.style.background = "var(--color-panel)";
                  }}
                >
                  <span style={{ color: "var(--color-amber)", marginRight: 8 }}>→</span>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        {messages.map((msg, i) => (
          <div key={i} className="fade-in">
            {msg.role === "user" ? (
              <UserBubble message={msg} />
            ) : (
              <AssistantBubble message={msg} />
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {loading && <ThinkingBubble />}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar (pinned to bottom) ── */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: 12,
          paddingBottom: 8,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        {/* Company selector row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {COMPANIES.map((c) => (
            <button
              key={c}
              onClick={() => setCompany(c)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.06em",
                padding: "3px 10px",
                borderRadius: 3,
                border: "1px solid",
                cursor: "pointer",
                transition: "all 0.12s",
                borderColor: company === c ? "var(--color-amber)" : "var(--color-border)",
                background: company === c ? "var(--color-amber-subtle)" : "transparent",
                color: company === c ? "var(--color-amber)" : "var(--color-text-secondary)",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Textarea + send */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            background: "var(--color-panel)",
            border: "1px solid var(--color-border-bright)",
            borderRadius: "var(--radius-md)",
            padding: "10px 12px",
            transition: "border-color 0.15s",
          }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--color-amber)")}
          onBlurCapture={(e) => (e.currentTarget.style.borderColor = "var(--color-border-bright)")}
        >
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask anything about TCS, Infosys, Wipro, HCLTech or TechMahindra..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--color-text-primary)",
              lineHeight: 1.5,
              padding: 0,
              maxHeight: 120,
              overflow: "auto",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !question.trim()}
            style={{
              background: loading || !question.trim() ? "var(--color-border)" : "var(--color-amber)",
              color: loading || !question.trim() ? "var(--color-text-muted)" : "#08090C",
              border: "none",
              borderRadius: "var(--radius-sm)",
              width: 34,
              height: 34,
              cursor: loading || !question.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            {loading ? <SpinnerIcon /> : <SendIcon />}
          </button>
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--color-text-muted)",
            marginTop: 6,
            textAlign: "center",
          }}
        >
          Enter to send · Shift+Enter for new line · answers cited to source documents
        </p>
      </div>
    </div>
  );
}

// ── User bubble ───────────────────────────────────────────────────────────────
function UserBubble({ message }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
      <div
        style={{
          maxWidth: "72%",
          background: "var(--color-panel)",
          border: "1px solid var(--color-border-bright)",
          borderRadius: "var(--radius-md)",
          padding: "10px 14px",
        }}
      >
        {message.company && message.company !== "All" && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--color-amber)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              display: "block",
              marginBottom: 5,
            }}
          >
            {message.company}
          </span>
        )}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--color-text-primary)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {message.content}
        </p>
      </div>
    </div>
  );
}

// ── Assistant bubble ──────────────────────────────────────────────────────────
function AssistantBubble({ message }) {
  if (message.error) {
    return (
      <div style={{ maxWidth: "90%" }}>
        <ErrorBanner message={message.error} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: "90%" }}>
      {/* Answer */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderLeft: "3px solid var(--color-amber)",
          borderRadius: "var(--radius-md)",
          padding: "14px 16px",
        }}
      >
        <span className="section-label" style={{ display: "block", marginBottom: 8 }}>
          Answer
        </span>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "var(--color-text-primary)",
            lineHeight: 1.75,
            whiteSpace: "pre-wrap",
            margin: 0,
          }}
        >
          {message.content}
        </p>
      </div>

      {/* Sources */}
      {message.sources?.length > 0 && (
        <div>
          <span className="section-label" style={{ display: "block", marginBottom: 8 }}>
            Sources — {message.sources.length} citation{message.sources.length !== 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {message.sources.map((src, i) => (
              <SourceCard key={i} source={src} />
            ))}
          </div>
        </div>
      )}

      {/* Explainability */}
      <ExplainPanel explainability={message.explainability} />
    </div>
  );
}

// ── Thinking indicator ────────────────────────────────────────────────────────
function ThinkingBubble() {
  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderLeft: "3px solid var(--color-amber)",
        borderRadius: "var(--radius-md)",
        maxWidth: 220,
      }}
    >
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-amber)",
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--color-text-muted)",
        }}
      >
        Searching corpus...
      </span>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: "spin 0.7s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}