import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import QAPage from "./pages/QAPage";
import ScorecardPage from "./pages/ScorecardPage";
import GuidancePage from "./pages/GuidancePage";
import ComparisonPage from "./pages/ComparisonPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ background: "var(--color-base)" }}>

        {/* ── Sidebar (desktop) ── */}
        <Sidebar />

        {/* ── Main content ── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Top bar */}
          <header
            className="flex items-center px-6 gap-3 flex-shrink-0"
            style={{
              height: 48,
              background: "var(--color-surface)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span className="section-label" style={{ color: "var(--color-text-faint)" }}>
              equity-research
            </span>
            <span style={{ color: "var(--color-text-faint)", fontSize: 10 }}>/</span>
            <span className="section-label" style={{ color: "var(--color-amber)" }}>
              indian-it
            </span>

            {/* Company pills */}
            <div className="ml-auto flex items-center gap-2">
              {[
                { label: "TCS",   color: "#60A5FA", bg: "rgba(59,130,246,0.12)" },
                { label: "INFY",  color: "#4ADE80", bg: "rgba(34,197,94,0.10)"  },
                { label: "WIPRO", color: "#C084FC", bg: "rgba(168,85,247,0.12)" },
                { label: "HCL",   color: "#F5A623", bg: "rgba(245,166,35,0.10)" },
                { label: "TM",    color: "#F87171", bg: "rgba(239,68,68,0.10)"  },
              ].map((c) => (
                <span
                  key={c.label}
                  className="badge"
                  style={{ color: c.color, background: c.bg }}
                >
                  {c.label}
                </span>
              ))}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/"           element={<QAPage />}         />
              <Route path="/scorecard"  element={<ScorecardPage />}  />
              <Route path="/guidance"   element={<GuidancePage />}   />
              <Route path="/comparison" element={<ComparisonPage />} />
            </Routes>
          </main>
        </div>

        {/* ── Mobile bottom tab bar ── */}
        <MobileTabBar />
      </div>
    </BrowserRouter>
  );
}

function MobileTabBar() {
  const tabs = [
    { to: "/",           label: "Q&A",        icon: <ChatIcon /> },
    { to: "/scorecard",  label: "Scorecard",   icon: <BarIcon />  },
    { to: "/guidance",   label: "Guidance",    icon: <TargetIcon />},
    { to: "/comparison", label: "Comparison",  icon: <TableIcon />},
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 flex"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        zIndex: 50,
      }}
    >
      {tabs.map((t) => (
        <a
          key={t.to}
          href={t.to}
          className="flex flex-col items-center justify-center flex-1 py-2 gap-1"
          style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
        >
          {t.icon}
          <span style={{ fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {t.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

// ── Inline SVG icons for mobile tab bar ──────────────────────────────────────
const I = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  />
);
const ChatIcon   = () => <I><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></I>;
const BarIcon    = () => <I><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 16V10M12 16V8M17 16v-4"/></I>;
const TargetIcon = () => <I><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></I>;
const TableIcon  = () => <I><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18"/></I>;