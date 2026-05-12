import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import QAPage from "./pages/QAPage";
import ScorecardPage from "./pages/ScorecardPage";
import GuidancePage from "./pages/GuidancePage";
import ComparisonPage from "./pages/ComparisonPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex w-full" style={{ background: "var(--color-base)", height: "100vh" }}>

        {/* ── Sidebar (desktop) ── */}
        <Sidebar />

        {/* ── Main content ── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Page content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
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