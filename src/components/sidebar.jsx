import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Q & A",
    badge: "RAG",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    to: "/scorecard",
    label: "Scorecard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M7 16V10M12 16V8M17 16v-4"/>
      </svg>
    ),
  },
  {
    to: "/guidance",
    label: "Guidance Tracker",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
      </svg>
    ),
  },
  {
    to: "/comparison",
    label: "Comparison",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="1"/>
        <path d="M3 9h18M3 15h18M9 3v18"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0"
      style={{
        width: 220,
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div
        className="flex flex-col px-5 py-5"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "var(--color-amber)",
            textTransform: "uppercase",
          }}
        >
          Equity Research
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "var(--color-text-secondary)",
            textTransform: "uppercase",
            marginTop: 3,
          }}
        >
          Indian IT · 5 Companies
        </span>
        <div
          style={{
            marginTop: 10,
            height: 1,
            width: "70%",
            background: "var(--color-amber)",
            opacity: 0.35,
          }}
        />
      </div>

      {/* Nav links */}
      <nav className="flex flex-col py-4 flex-1">
        <span
          className="section-label px-5 mb-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Analysis
        </span>

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 20px",
              textDecoration: "none",
              borderLeft: isActive
                ? "2px solid var(--color-amber)"
                : "2px solid transparent",
              background: isActive
                ? "var(--color-amber-subtle)"
                : "transparent",
              color: isActive
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
              transition: "all 0.12s",
            })}
          >
            {({ isActive }) => (
              <>
                <span
                  style={{
                    color: isActive
                      ? "var(--color-amber)"
                      : "var(--color-text-secondary)",
                    display: "flex",
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    fontWeight: 400,
                  }}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className="badge ml-auto"
                    style={{
                      background: "var(--color-amber-subtle)",
                      color: "var(--color-amber)",
                      fontSize: 8,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-green)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--color-text-secondary)",
              letterSpacing: "0.05em",
            }}
          >
            Backend connected
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "var(--color-text-muted)",
            marginTop: 4,
            letterSpacing: "0.05em",
          }}
        >
          v1.0 · Groq · ChromaDB
        </div>
      </div>
    </aside>
  );
}