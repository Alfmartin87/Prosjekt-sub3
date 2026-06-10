import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard.jsx";
import TrainingLog from "./components/TrainingLog.jsx";
import Progress from "./components/Progress.jsx";
import BeetrootProtocol from "./components/BeetrootProtocol.jsx";
import { SEED_WEEKS } from "./data/trainingData";
import "./App.css";

const STORAGE_KEY = "berlin-sub3-v1";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) { setWeeks(parsed); return; }
    }
    setWeeks(SEED_WEEKS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_WEEKS));
  }, []);

  function saveWeeks(updated) {
    setWeeks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const nav = [
    { id: "dashboard", label: "DASHBOARD", icon: "⬡" },
    { id: "log", label: "LOGG", icon: "◈" },
    { id: "progress", label: "FREMGANG", icon: "◎" },
    { id: "beetroot", label: "RØDBETE", icon: "◉" },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">BERLIN</span>
            <span className="logo-sub">SUB·3·00</span>
          </div>
          <nav className="nav">
            {nav.map(n => (
              <button
                key={n.id}
                className={`nav-btn ${page === n.id ? "active" : ""}`}
                onClick={() => setPage(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        {page === "dashboard" && <Dashboard weeks={weeks} setPage={setPage} />}
        {page === "log" && <TrainingLog weeks={weeks} saveWeeks={saveWeeks} />}
        {page === "progress" && <Progress weeks={weeks} />}
        {page === "beetroot" && <BeetrootProtocol />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {nav.map(n => (
          <button
            key={n.id}
            className={`bottom-nav-btn ${page === n.id ? "active" : ""}`}
            onClick={() => setPage(n.id)}
          >
            <span className="bottom-nav-icon">{n.icon}</span>
            <span className="bottom-nav-label">{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
