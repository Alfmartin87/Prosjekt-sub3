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
    const storedWeeks = stored ? JSON.parse(stored) : [];

    // Merge: start with SEED_WEEKS, then overlay any manually edited weeks from localStorage
    // localStorage weeks that match a weekStart in SEED_WEEKS take priority (user edits win)
    // localStorage weeks NOT in SEED_WEEKS are also kept (manually added weeks)
    const seedMap = new Map(SEED_WEEKS.map(w => [w.weekStart, w]));
    const storedMap = new Map(storedWeeks.map(w => [w.weekStart, w]));

    // Union of all weekStarts
    const allKeys = new Set([...seedMap.keys(), ...storedMap.keys()]);

    const merged = Array.from(allKeys).map(key => {
      // If user has manually edited this week in localStorage, use that version
      // Otherwise use SEED_WEEKS version
      return storedMap.get(key) || seedMap.get(key);
    });

    // Sort newest first
    merged.sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));

    setWeeks(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }, []);

  function saveWeeks(updated) {
    setWeeks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Manuell "hent nyeste data"-knapp: tommer lagret cache og laster appen paa nytt,
  // slik at SEED_WEEKS fra trainingData.js alltid vinner igjen etter en commit.
  // OBS: dette overskriver ogsaa eventuelle manuelle redigeringer gjort i appen
  // for uker som allerede finnes i SEED_WEEKS - derfor er dette en bevisst,
  // bekreftet handling og ikke noe som skjer automatisk.
  function refreshFromSource() {
    const ok = window.confirm(
      "Dette henter nyeste data fra kildefilen og overskriver eventuelle manuelle endringer du har gjort i appen for uker som allerede finnes der. Fortsette?"
    );
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  const nav = [
    { id: "dashboard", label: "DASHBOARD", icon: "#" },
    { id: "log", label: "LOGG", icon: "+" },
    { id: "progress", label: "FREMGANG", icon: "~" },
    { id: "beetroot", label: "RODBETE", icon: "@" },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">BERLIN</span>
            <span className="logo-sub">SUB-3-00</span>
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
          <button
            className="btn"
            style={{ fontSize: 10, padding: "5px 10px", marginLeft: 8 }}
            onClick={refreshFromSource}
            title="Tommer lagret cache og laster inn nyeste data fra trainingData.js paa nytt"
          >
            OPPDATER DATA
          </button>
        </div>
      </header>
      <main className="main">
        {page === "dashboard" && <Dashboard weeks={weeks} setPage={setPage} />}
        {page === "log" && <TrainingLog weeks={weeks} saveWeeks={saveWeeks} />}
        {page === "progress" && <Progress weeks={weeks} />}
        {page === "beetroot" && <BeetrootProtocol />}
      </main>
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

