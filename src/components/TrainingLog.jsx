 import { useState } from "react";

const ACHILLES_LABELS = ["", "Smertefri", "Litt stiv morgen", "Stiv + merkbar", "Smerter under l√∏p", "M√•tte stoppe"];
const ACHILLES_COLORS = ["", "#2ecc71", "#a3e635", "#facc15", "#fb923c", "#e74c3c"];
const FEELING_LABELS = ["", "Veldig d√•rlig", "D√•rlig", "N√∏ytral", "Bra", "Veldig bra"];

const EMPTY = {
  weekStart: "", totalKm: "", longRunKm: "", longRunPace: "", tss: "",
  intensityDistribution: { easy: "", hard: "" },
  achilles: "1", feeling: "3", comments: "", keyWorkout: "",
  stryd: { cp: "", avgPower: "", formPower: "", legStiffness: "" },
  hrv: "", sleepHours: "",
};

function getISOWeek(dateStr) {
  const date = new Date(dateStr);
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getWeekDateRange(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay() || 7;
  const mon = new Date(date);
  mon.setDate(date.getDate() - day + 1);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  const fmt = d => d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
  return `${fmt(mon)} ‚Äì ${fmt(sun)}`;
}

export default function TrainingLog({ weeks, saveWeeks }) {
  const [form, setForm] = useState({ ...EMPTY });
  const [editIndex, setEditIndex] = useState(null);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("form");

  function hc(f, v) { setForm(x => ({ ...x, [f]: v })); }
  function hn(p, f, v) { setForm(x => ({ ...x, [p]: { ...x[p], [f]: v } })); }

  function handleSubmit() {
    if (!form.weekStart) return;
    let updated;
    if (editIndex !== null) {
      updated = weeks.map((w, i) => i === editIndex ? form : w);
      setEditIndex(null);
    } else {
      updated = [form, ...weeks].sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
    }
    saveWeeks(updated);
    setForm({ ...EMPTY });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTab("history");
  }

  function handleEdit(i) {
    setForm(weeks[i]);
    setEditIndex(i);
    setTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(i) {
    if (window.confirm("Slette denne uka?")) {
      saveWeeks(weeks.filter((_, idx) => idx !== i));
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["form", "history"].map(t => (
          <button key={t} className={`btn ${tab === t ? "btn-primary" : ""}`} onClick={() => setTab(t)}>
            {t === "form" ? (editIndex !== null ? "‚úé REDIGERER" : "+ NY UKE") : `HISTORIKK (${weeks.length})`}
          </button>
        ))}
      </div>

      {tab === "form" && (
        <div className="card">
          <div className="section-label">
            {editIndex !== null
              ? `Redigerer uke ${weeks[editIndex]?.weekStart ? getISOWeek(weeks[editIndex].weekStart) : ""}`
              : "Logg ny uke"}
          </div>

          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div><label>Uke starter</label><input type="date" value={form.weekStart} onChange={e => hc("weekStart", e.target.value)} /></div>
            <div><label>N√∏kkel√∏kt</label><input placeholder="f.eks. 2√ó20 min IntEnd" value={form.keyWorkout} onChange={e => hc("keyWorkout", e.target.value)} /></div>
          </div>

          <div className="section-label">Volum og tempo</div>
          <div className="grid-3" style={{ marginBottom: 20 }}>
            <div><label>Totalt km</label><input type="number" placeholder="65" value={form.totalKm} onChange={e => hc("totalKm", e.target.value)} /></div>
            <div><label>Langtur km</label><input type="number" placeholder="28" value={form.longRunKm} onChange={e => hc("longRunKm", e.target.value)} /></div>
            <div><label>Langtur pace</label><input placeholder="4:45" value={form.longRunPace} onChange={e => hc("longRunPace", e.target.value)} /></div>
          </div>

          <div className="section-label">Belastning</div>
          <div className="grid-3" style={{ marginBottom: 20 }}>
            <div><label>TSS</label><input type="number" placeholder="420" value={form.tss} onChange={e => hc("tss", e.target.value)} /></div>
            <div><label>% Easy (sone 1‚Äì2)</label><input type="number" placeholder="80" value={form.intensityDistribution.easy} onChange={e => hn("intensityDistribution", "easy", e.target.value)} /></div>
            <div><label>% Hard (sone 3+)</label><input type="number" placeholder="10" value={form.intensityDistribution.hard} onChange={e => hn("intensityDistribution", "hard", e.target.value)} /></div>
          </div>

          <div className="section-label">Stryd / Watt</div>
          <div className="grid-4" style={{ marginBottom: 20 }}>
            <div><label>CP (W)</label><input type="number" placeholder="285" value={form.stryd.cp} onChange={e => hn("stryd", "cp", e.target.value)} /></div>
            <div><label>Snitt watt</label><input type="number" placeholder="255" value={form.stryd.avgPower} onChange={e => hn("stryd", "avgPower", e.target.value)} /></div>
            <div><label>Form power</label><input type="number" placeholder="79" value={form.stryd.formPower} onChange={e => hn("stryd", "formPower", e.target.value)} /></div>
            <div><label>Leg stiffness</label><input type="number" placeholder="9.8" value={form.stryd.legStiffness} onChange={e => hn("stryd", "legStiffness", e.target.value)} /></div>
          </div>

          <div className="section-label">Restitusjon</div>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div><label>Snitt HRV</label><input type="number" placeholder="75" value={form.hrv} onChange={e => hc("hrv", e.target.value)} /></div>
            <div><label>Snitt s√∏vn (timer)</label><input type="number" placeholder="7.5" step="0.1" value={form.sleepHours} onChange={e => hc("sleepHours", e.target.value)} /></div>
          </div>

          <div className="section-label">Subjektivt</div>
          <div style={{ marginBottom: 16 }}>
            <label>Akilles ‚Äì {ACHILLES_LABELS[form.achilles]}</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <input type="range" min="1" max="5" value={form.achilles} onChange={e => hc("achilles", e.target.value)} style={{ flex: 1 }} />
              <span className="tag" style={{ background: ACHILLES_COLORS[form.achilles] + "22", color: ACHILLES_COLORS[form.achilles], border: `1px solid ${ACHILLES_COLORS[form.achilles]}44` }}>{form.achilles}/5</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Form ‚Äì {FEELING_LABELS[form.feeling]}</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <input type="range" min="1" max="5" value={form.feeling} onChange={e => hc("feeling", e.target.value)} style={{ flex: 1 }} />
              <span style={{ fontSize: 13, color: "var(--text2)", minWidth: 28 }}>{form.feeling}/5</span>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>Kommentarer</label>
            <textarea rows={3} placeholder="Akilles, justeringer, reiser, v√¶r, sykdom..." value={form.comments} onChange={e => hc("comments", e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-primary" onClick={handleSubmit}>{editIndex !== null ? "Oppdater" : "Lagre uke"}</button>
            {editIndex !== null && (
              <button className="btn" onClick={() => { setForm({ ...EMPTY }); setEditIndex(null); }}>Avbryt</button>
            )}
            {saved && <span style={{ fontSize: 11, color: "var(--green)", letterSpacing: "0.08em" }}>‚úì Lagret</span>}
          </div>
        </div>
      )}

      {tab === "history" && (
        <div>
          {weeks.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--text3)", padding: "60px 0", fontSize: 13 }}>Ingen uker logget enn√•</div>
          )}
          {weeks.map((w, i) => (
            <div className="card" key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 22, fontWeight: 700, letterSpacing: "0.05em" }}>
                    {w.weekStart ? `UKE ${getISOWeek(w.weekStart)}` : "‚Äî"}
                  </div>
                  {w.weekStart && (
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2, letterSpacing: "0.06em" }}>
                      {getWeekDateRange(w.weekStart)}
                    </div>
                  )}
                  {w.keyWorkout && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>‚óà {w.keyWorkout}</div>}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn" style={{ padding: "5px 12px", fontSize: 10 }} onClick={() => handleEdit(i)}>REDIGER</button>
                  <button className="btn btn-danger" style={{ padding: "5px 12px", fontSize: 10 }} onClick={() => handleDelete(i)}>SLETT</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                {[
                  [w.totalKm, "km", "var(--blue)"],
                  [w.longRunKm && w.longRunKm + " km", "langtur", "var(--text2)"],
                  [w.longRunPace && w.longRunPace, "/km", "var(--text2)"],
                  [w.stryd?.avgPower && w.stryd.avgPower + "W", "", "var(--amber)"],
                  [w.tss, "TSS", "var(--purple)"],
                  [w.hrv && "HRV " + w.hrv, "", "var(--teal)"],
                  [w.sleepHours && w.sleepHours + "t", "s√∏vn", "var(--text3)"],
                ].filter(([v]) => v).map(([v, u, c], j) => (
                  <span key={j}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 20, fontWeight: 700, color: c }}>{v}</span>
                    {u && <span style={{ fontSize: 10, color: "var(--text3)", marginLeft: 3 }}>{u}</span>}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: w.comments ? 10 : 0 }}>
                <span className="tag" style={{ background: ACHILLES_COLORS[w.achilles] + "18", color: ACHILLES_COLORS[w.achilles], border: `1px solid ${ACHILLES_COLORS[w.achilles]}33` }}>
                  AKILLES {w.achilles}/5
                </span>
                <span className="tag" style={{ background: "var(--bg3)", color: "var(--text3)", border: "1px solid var(--border)" }}>
                  FORM {w.feeling}/5
                </span>
                {w.intensityDistribution?.easy && (
                  <span className="tag" style={{ background: "#0d3d2222", color: "var(--green)", border: "1px solid #0d3d22" }}>{w.intensityDistribution.easy}% EASY</span>
                )}
                {w.intensityDistribution?.hard && (
                  <span className="tag" style={{ background: "var(--red-dim)", color: "var(--red)", border: "1px solid #3d1010" }}>{w.intensityDistribution.hard}% HARD</span>
                )}
              </div>

              {w.comments && (
                <div style={{ fontSize: 11, color: "var(--text3)", borderTop: "1px solid var(--border)", paddingTop: 10, lineHeight: 1.7 }}>
                  {w.comments}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

