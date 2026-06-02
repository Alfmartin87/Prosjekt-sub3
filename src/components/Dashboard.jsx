import { BERLIN_DATE, BERGEN_FM_DATE } from "../data/trainingData";

const ACHILLES_LABELS = ["", "Smertefri", "Litt stiv morgen", "Stiv + merkbar", "Smerter under løp", "Måtte stoppe"];
const ACHILLES_COLORS = ["", "#2ecc71", "#a3e635", "#facc15", "#fb923c", "#e74c3c"];

function daysUntil(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function weekAvg(weeks, n, getter) {
  const slice = weeks.slice(0, n).map(getter).filter(v => v > 0);
  return slice.length ? (slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(1) : "—";
}

export default function Dashboard({ weeks, setPage }) {
  const latest = weeks[0];
  const dBerlin = daysUntil(BERLIN_DATE);
  const dBergen = daysUntil(BERGEN_FM_DATE);

  const avg4km = weekAvg(weeks, 4, w => Number(w.totalKm) || 0);
  const avg4tss = weekAvg(weeks, 4, w => Number(w.tss) || 0);
  const avg4hrv = weekAvg(weeks, 4, w => Number(w.hrv) || 0);
  const avg4watt = weekAvg(weeks, 4, w => Number(w.stryd?.avgPower) || 0);

  const achillesColor = latest ? ACHILLES_COLORS[latest.achilles] : "#2ecc71";
  const achillesLabel = latest ? ACHILLES_LABELS[latest.achilles] : "—";

  // Trend: last week vs week before
  const trendKm = weeks.length >= 2
    ? ((Number(weeks[0].totalKm) - Number(weeks[1].totalKm)) / Number(weeks[1].totalKm) * 100).toFixed(0)
    : null;

  return (
    <div>
      {/* Countdown row */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card" style={{ borderColor: "var(--blue-dim)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle at top right, #3d6fff12, transparent 70%)", pointerEvents: "none" }} />
          <div className="section-label">Berlin Marathon</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 72, fontWeight: 800, color: "var(--blue)", lineHeight: 1 }}>{dBerlin}</span>
            <span style={{ fontSize: 14, color: "var(--text2)" }}>dager</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6, letterSpacing: "0.1em" }}>27. SEPTEMBER 2026 · MÅL 2:59:59</div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text3)" }}>FREMGANG</span>
              <span style={{ fontSize: 10, color: "var(--text3)" }}>EST. {Math.round((1 - dBerlin / 180) * 100)}% AV SESONG</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${Math.min(Math.round((1 - dBerlin / 180) * 100), 100)}%`, background: "var(--blue)" }} />
            </div>
          </div>
        </div>

        <div className="card" style={{ borderColor: "#2ecc7122" }}>
          <div className="section-label">Bergen Fjellmaraton</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 72, fontWeight: 800, color: "var(--green)", lineHeight: 1 }}>{dBergen}</span>
            <span style={{ fontSize: 14, color: "var(--text2)" }}>dager</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6, letterSpacing: "0.1em" }}>29. AUGUST 2026 · AVVENTER FYSIO</div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text3)" }}>RØDBETEPROTOKOLL</span>
              <span style={{ fontSize: 10, color: "var(--amber)" }}>START {Math.max(dBergen - 6, 0)} DAGER FØR</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${Math.min(Math.round((1 - dBergen / 120) * 100), 100)}%`, background: "var(--green)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-label">Siste 4 uker – snitt</div>
        <div className="grid-4">
          {[
            { label: "KM / UKE", value: avg4km, unit: "km", color: "var(--blue)" },
            { label: "WATT SNITT", value: avg4watt, unit: "W", color: "var(--amber)" },
            { label: "HRV", value: avg4hrv, unit: "", color: Number(avg4hrv) >= 80 ? "var(--green)" : Number(avg4hrv) >= 70 ? "var(--amber)" : "var(--red)" },
            { label: "TSS / UKE", value: avg4tss, unit: "", color: "var(--purple)" },
          ].map(({ label, value, unit, color }) => (
            <div className="stat-block" key={label}>
              <div className="stat-label">{label}</div>
              <div className="stat-value" style={{ color }}>
                {value}<span className="stat-unit">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest week + akilles */}
      {latest && (
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="card">
            <div className="section-label">Siste loggede uke</div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>
              {new Date(latest.weekStart).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 14, flexWrap: "wrap" }}>
              {[
                [latest.totalKm, "km", "var(--blue)"],
                [latest.longRunKm, "langtur", "var(--text2)"],
                [latest.stryd?.avgPower && latest.stryd.avgPower + "W", "", "var(--amber)"],
                [latest.tss, "TSS", "var(--purple)"],
              ].filter(([v]) => v).map(([v, u, c], i) => (
                <span key={i}>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 700, color: c }}>{v}</span>
                  {u && <span style={{ fontSize: 10, color: "var(--text3)", marginLeft: 3 }}>{u}</span>}
                </span>
              ))}
            </div>
            {latest.keyWorkout && (
              <div style={{ fontSize: 11, color: "var(--text3)", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                ◈ {latest.keyWorkout}
              </div>
            )}
            {trendKm && (
              <div style={{ marginTop: 8, fontSize: 11, color: Number(trendKm) >= 0 ? "var(--green)" : "var(--amber)" }}>
                {Number(trendKm) >= 0 ? "↑" : "↓"} {Math.abs(trendKm)}% vs forrige uke
              </div>
            )}
          </div>

          <div className="card">
            <div className="section-label">Akilles-status</div>
            <div style={{ display: "flex", align: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: achillesColor, marginTop: 2, flexShrink: 0, boxShadow: `0 0 12px ${achillesColor}88` }} />
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 22, fontWeight: 700, color: achillesColor }}>{achillesLabel}</div>
                <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>SISTE REGISTRERTE UKE</div>
              </div>
            </div>

            <div className="section-label" style={{ marginTop: 8 }}>Trend (8 uker)</div>
            {weeks.slice(0, 8).map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <div style={{ fontSize: 9, color: "var(--text3)", minWidth: 40 }}>
                  {w.weekStart ? new Date(w.weekStart).toLocaleDateString("nb-NO", { day: "numeric", month: "numeric" }) : "—"}
                </div>
                <div className="bar-track" style={{ flex: 1 }}>
                  <div className="bar-fill" style={{ width: `${(Number(w.achilles) / 5) * 100}%`, background: ACHILLES_COLORS[w.achilles] }} />
                </div>
                <div style={{ fontSize: 9, color: ACHILLES_COLORS[w.achilles], minWidth: 24 }}>{w.achilles}/5</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-3 targets */}
      <div className="card" style={{ borderColor: "var(--blue-dim)" }}>
        <div className="section-label">Sub-3 referanseverdier</div>
        <div className="grid-4">
          {[
            { label: "MÅLPACE", value: "4:16", unit: "/km" },
            { label: "OBLA FART", value: "14,5", unit: "km/t" },
            { label: "OBLA PULS", value: "174", unit: "bpm" },
            { label: "UKESVOLUM", value: "70–85", unit: "km" },
            { label: "LANGTUR PACE", value: "4:30–50", unit: "/km" },
            { label: "LANGTUR WATT", value: "250–270", unit: "W" },
            { label: "TSS / UKE", value: "400–520", unit: "" },
            { label: "EASY %", value: "≥80", unit: "%" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="card-sm" style={{ marginBottom: 0 }}>
              <div className="stat-label">{label}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 18, fontWeight: 700, color: "var(--blue)", marginTop: 4 }}>
                {value}<span style={{ fontSize: 11, color: "var(--text3)", marginLeft: 3 }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
