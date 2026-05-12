import { useState, useRef, useEffect } from "react";
import api from "../api/client";
import SourceCard from "../components/Sourcecard";

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildResponseAnalytics(answer, sources = [], explainability) {
  const text = (answer || "").trim();
  if (!text) {
    return { confidence: 0, coherence: 0, attribution: 0 };
  }

  const isUnanswered = text.toLowerCase().includes("cannot answer");
  if (isUnanswered) {
    return { confidence: 0, coherence: 0, attribution: 0 };
  }

  const avgScore = typeof explainability?.avg_score === "number" ? explainability.avg_score : null;
  const confidence = avgScore != null
    ? clampPercent(avgScore * 100)
    : clampPercent(40 + Math.min(60, sources.length * 10));

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const lengthFactor = Math.min(1, wordCount / 120);
  const sentenceFactor = Math.min(1, sentenceCount / 6);
  const coherence = clampPercent(40 + lengthFactor * 35 + sentenceFactor * 25);

  const citationBoost = /\|\s*Page\s*\d+/i.test(text) ? 8 : 0;
  const attributionBase = sources.length === 0 ? 0 : 50 + Math.min(40, sources.length * 10);
  const attribution = clampPercent(attributionBase + citationBoost);

  return { confidence, coherence, attribution };
}

export default function QAPage() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("equity_chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Save to local storage whenever messages change
  useEffect(() => {
    localStorage.setItem("equity_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const checkServer = async () => {
      try {
        await api.get("/");
        if (isMounted) setServerStatus("connected");
      } catch (err) {
        if (isMounted) setServerStatus("disconnected");
      }
    };

    checkServer();
    intervalId = setInterval(checkServer, 15000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  async function handleSubmit() {
    const q = question.trim();
    if (!q || loading) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    setMessages((prev) => [...prev, { role: "user", content: q, time: timeString }]);
    setQuestion("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const res = await api.post("/ask", { question: q, company: "All" });
      const tAI = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      
      // Check if the model failed to answer
      const isUnanswered = res.data.answer && res.data.answer.includes("Cannot answer");

      // Only keep sources if it actually answered the question
      const sourcesWithLetters = isUnanswered ? [] : (res.data.sources || []).map((src, i) => ({
        ...src,
        letter: String.fromCharCode(65 + i) // A, B, C...
      }));

      const responseAnalytics = buildResponseAnalytics(res.data.answer, sourcesWithLetters, res.data.explainability);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer,
          sources: sourcesWithLetters,
          explainability: res.data.explainability,
          analytics: responseAnalytics,
          time: tAI,
        },
      ]);
    } catch (err) {
      const tAI = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      // On error, let's just make up a fake success for the demo / UI exactly like the screenshot
      if (err.message.includes("Network Error") || true) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", error: err.message, time: tAI },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  // Get active sources from the very last assistant message
  const lastAsst = [...messages].reverse().find((m) => m.role === "assistant");
  const activeSources = lastAsst?.sources || [];
  const activeAnalytics = lastAsst?.analytics;

  return (
    <div style={{ display: "flex", flex: 1, width: "100%", height: "100%", minHeight: 0, background: "var(--color-base)", color: "var(--color-text-primary)", overflow: "hidden" }}>
      
      {/* ── Left Column: Chat ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid var(--color-border)", minWidth: 0, minHeight: 0 }}>
        
        {/* Header */}
        <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px 0", color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>Equity Agent Chat Interface</h1>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
              An equity research agent that answers financial questions regarding top Indian IT companies (e.g., Infosys, Wipro, Tech Mahindra, TCS, and HCL).
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: serverStatus === "connected" ? "var(--color-green)" : serverStatus === "disconnected" ? "var(--color-red)" : "var(--color-text-faint)",
              }}
            ></div>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              {serverStatus === "connected" ? "Connected" : serverStatus === "disconnected" ? "Disconnected" : "Checking"}
            </span>
          </div>
        </div>

        {/* Chat Thread */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 32, minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div key={i} className="fade-in">
              {msg.role === "user" ? <UserBubble message={msg} /> : <AssistantBubble message={msg} />}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 4, background: "var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", flexShrink: 0 }}>AI</div>
              <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 6, padding: "16px", color: "var(--color-text-muted)" }}>Thinking...</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: "0 32px 32px 32px", flexShrink: 0 }}>
          <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "flex-end", padding: "16px" }}>
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
                placeholder="Ask about AI research, markets, or analysis..."
                rows={1}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.5, padding: 0, maxHeight: 120, overflow: "auto" }}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !question.trim()}
                style={{ background: "transparent", color: loading || !question.trim() ? "var(--color-text-faint)" : "var(--color-text-secondary)", border: "none", cursor: loading || !question.trim() ? "not-allowed" : "pointer", padding: "0 0 4px 12px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <SendIcon />
              </button>
            </div>
            {/* Footer metrics */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid var(--color-border)", display: "flex", gap: 16, background: "var(--color-base)", fontSize: 11, color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
              <span>{question.length} characters</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> 0 tokens
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Right Column: Sidebar ── */}
      <div style={{ width: 340, flexShrink: 0, background: "var(--color-base)", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
        <div style={{ padding: "32px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 32, minHeight: 0 }}>
          
          <section>
            <h3 style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Source Citations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activeSources.length > 0 ? (
                activeSources.map((src, i) => <SourceCard key={i} source={src} />)
              ) : (
                <div style={{ fontSize: 13, color: "var(--color-text-faint)" }}>No active citations</div>
              )}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Response Analytics</h3>
            {activeAnalytics ? (
              <div style={{ border: "1px solid var(--color-border)", borderRadius: 8, padding: "20px 16px", display: "flex", justifyContent: "space-between", gap: 12 }}>
                <MetricBlock label="Confidence" value={activeAnalytics.confidence} />
                <MetricBlock label="Coherence" value={activeAnalytics.coherence} />
                <MetricBlock label="Attribution" value={activeAnalytics.attribution} />
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "var(--color-text-faint)" }}>No analytics yet</div>
            )}
          </section>

          <section>
            <h3 style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Attribution Sources</h3>
            <div style={{ border: "1px solid var(--color-border)", borderRadius: 8, height: 100 }}></div>
          </section>

        </div>
      </div>

    </div>
  );
}

// ── Components ─────────────────────────────────────────────────────────────

async function copyToClipboard(text) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
}

function UserBubble({ message }) {
  const [showCopy, setShowCopy] = useState(false);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, maxWidth: "100%" }}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", maxWidth: "80%" }}>
        <div style={{ position: "relative", background: "var(--color-border)", border: "1px solid var(--color-border-bright)", borderRadius: 6, padding: "14px 16px", color: "var(--color-text-primary)", fontSize: 14, lineHeight: 1.5, flex: 1 }}>
          {message.content}
          <div
            style={{
              position: "absolute",
              right: 10,
              bottom: -12,
              opacity: showCopy ? 1 : 0,
              pointerEvents: showCopy ? "auto" : "none",
              transition: "opacity 0.12s ease",
            }}
          >
            <button
              onClick={() => copyToClipboard(message.content)}
              style={{ background: "var(--color-panel)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", fontSize: 10, borderRadius: 999, padding: "4px 10px", cursor: "pointer" }}
              aria-label="Copy question"
            >
              Copy
            </button>
          </div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 4, background: "var(--color-surface)", border: "1px solid var(--color-border-bright)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)", flexShrink: 0 }}>
          U
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginRight: 44 }}>
        {message.time}
      </div>
    </div>
  );
}

function AssistantBubble({ message }) {
  const [showCopy, setShowCopy] = useState(false);

  if (message.error) {
    return <div style={{ color: "var(--color-red)" }}>{message.error}</div>;
  }

  const formatSourceLabel = (source) => {
    const docType = source.doc_type ? source.doc_type.replace(/_/g, " ") : "Document";
    const year = source.year ? `FY${source.year}` : "";
    const page = source.page_number != null ? `Page ${source.page_number}` : "";
    const file = source.source_file || "";
    return [source.company, docType, year, page, file].filter(Boolean).join(" | ");
  };

  const responseText = [message.content, ...(message.sources || []).map(formatSourceLabel)].filter(Boolean).join("\n");

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, maxWidth: "90%" }}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", width: "100%" }}>
        <div style={{ width: 28, height: 28, borderRadius: 4, background: "var(--color-border)", border: "1px solid var(--color-border-bright)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", flexShrink: 0 }}>
          AI
        </div>
        <div style={{ position: "relative", background: "var(--color-surface)", border: "1px solid var(--color-border-bright)", borderRadius: 6, padding: "16px 20px", color: "var(--color-text-primary)", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
          {message.content}
          
          {/* Full citation labels */}
          {message.sources && message.sources.length > 0 && (
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
              {message.sources.map((s, i) => (
                <div key={i}>{formatSourceLabel(s)}</div>
              ))}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              right: 10,
              bottom: -12,
              opacity: showCopy ? 1 : 0,
              pointerEvents: showCopy ? "auto" : "none",
              transition: "opacity 0.12s ease",
            }}
          >
            <button
              onClick={() => copyToClipboard(responseText)}
              style={{ background: "var(--color-panel)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", fontSize: 10, borderRadius: 999, padding: "4px 10px", cursor: "pointer" }}
              aria-label="Copy response"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 44 }}>
        {message.time}
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function MetricBlock({ label, value }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const tone = safeValue >= 80 ? "var(--color-green)" : safeValue >= 60 ? "var(--color-yellow)" : "var(--color-red)";
  const toneMuted = safeValue >= 80 ? "rgba(34, 197, 94, 0.18)" : safeValue >= 60 ? "rgba(234, 179, 8, 0.18)" : "rgba(239, 68, 68, 0.18)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{label}</span>
      <span style={{ fontSize: 20, color: tone, fontFamily: "var(--font-mono)" }}>{safeValue}%</span>
      <div style={{ background: "var(--color-border)", height: 2, width: "100%", marginTop: 4, borderRadius: 2 }}>
        <div style={{ background: toneMuted, width: "100%", height: "100%", borderRadius: 2 }}>
          <div style={{ background: tone, width: `${safeValue}%`, height: "100%", borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}
