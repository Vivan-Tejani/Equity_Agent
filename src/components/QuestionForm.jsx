const COMPANIES = ["All", "TCS", "Infosys", "Wipro", "HCLTech", "TechMahindra"];

export default function QuestionForm({ onSubmit, loading }) {
  return (
    <div
      className="card"
      style={{ padding: "16px", marginBottom: "20px" }}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        {/* Company selector */}
        <select
          id="company-select"
          className="form-control"
          style={{ width: 148, flexShrink: 0 }}
          defaultValue="All"
        >
          {COMPANIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Question input */}
        <textarea
          id="question-input"
          className="form-control"
          placeholder="Ask anything — e.g. What is TCS revenue growth in FY25?"
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            lineHeight: 1.5,
            paddingTop: "8px",
            overflow: "hidden",
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--color-text-muted)",
          }}
        >
          Press Enter to submit · Shift+Enter for new line
        </span>

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          {loading ? (
            <>
              <Spinner />
              Thinking...
            </>
          ) : (
            "Ask →"
          )}
        </button>
      </div>
    </div>
  );

  function handleSubmit() {
    const question = document.getElementById("question-input").value.trim();
    const company  = document.getElementById("company-select").value;
    if (!question || loading) return;
    onSubmit({ question, company });
  }
}

function Spinner() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.7s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}