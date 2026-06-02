import { useState } from "react";

const BERGEN_DATE = "2026-08-29";
const BERLIN_DATE = "2026-09-27";

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function buildProtocol(raceDate) {
  const race = new Date(raceDate);
  const days = [];
  for (let i = 6; i >= -1; i--) {
    const d = new Date(race);
    d.setDate(race.getDate() - i);
    const daysFromNow = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
    let note = "";
    if (i === 6) note = "Start opplasting – 1 dose";
    else if (i > 1) note = "Daglig dose – bygg opp";
    else if (i === 1) note = "1 dose kvelden før løp";
    else if (i === 0) note = "1 dose 2–3 timer før start";
    else note = "Løpsdag";
    days.push({
      date: d.toLocaleDateString("nb-NO", { weekday: "short", day: "numeric", month: "short" }),
      daysFromNow,
      note,
      isRace: i === 0,
      isPast: daysFromNow < 0,
      isToday: daysFromNow === 0,
      daysBeforeRace: i,
    });
  }
  return days;
}

export default function BeetrootProtocol() {
  const [race, setRace] = useState("bergen");
  const raceDate = race === "bergen" ? BERGEN_DATE : BERLIN_DATE;
  const protocol = buildProtocol(raceDate);
  const dLeft = daysUntil(raceDate);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["bergen", "Bergen Fjellmaraton"], ["berlin", "Berlin Marathon"]].map(([id, label]) => (
          <button key={id} className={`btn ${race === id ? "btn-primary" : ""}`} onClick={() => setRace(id)}>
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      <div className="card" style={{ borderColor: race === "bergen" ? "#2ecc7133" : "var(--blue-dim)" }}>
        <div className="section-label">{race === "bergen" ? "Bergen Fjellmaraton · 29. aug 2026" : "Berlin Marathon · 27. sep 2026"}</div>
        <div style={{ display: "flex", gap: 40, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 64, fontWeight: 800, color: race === "bergen" ? "var(--green)" : "var(--blue)", lineHeight: 1 }}>{dLeft}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em" }}>DAGER TIL LØPET</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>START OPPLASTING</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 18, fontWeight: 600 }}>Dag {dLeft - 6} fra nå ({Math.max(dLeft - 6, 0)} dager)</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>PRODUKT</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 18, fontWeight: 600 }}>Beet It Nitrate 3000 · 35ml/dose</div>
            </div>
          </div>
        </div>

        {race === "bergen" && (
          <div style={{ background: "var(--amber-dim)", border: "1px solid var(--amber)33", borderRadius: 6, padding: "10px 14px", fontSize: 11, color: "var(--amber)" }}>
            ⚠ Avventer grønt lys fra fysio. Protokollen er klar – starter opplasting når beslutning er tatt.
          </div>
        )}
      </div>

      {/* Protocol timeline */}
      <div className="card">
        <div className="section-label">Opplastingsprotokoll</div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 1, background: "var(--border)" }} />
          {protocol.map((day, i) => (
            <div key={i} style={{
              display: "flex", gap: 20, marginBottom: 12, position: "relative",
              opacity: day.isPast ? 0.4 : 1,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4,
                background: day.isRace ? "var(--blue)" : day.isPast ? "var(--text3)" : "var(--green)",
                boxShadow: day.isRace ? "0 0 12px var(--blue)" : day.isToday ? "0 0 10px var(--green)" : "none",
                position: "relative", zIndex: 1, marginLeft: 12,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 15, fontWeight: 600, color: day.isRace ? "var(--blue)" : "var(--text)" }}>
                    {day.date}
                  </span>
                  {day.isRace && <span className="tag" style={{ background: "var(--blue-dim)", color: "var(--blue)", border: "1px solid var(--blue)44" }}>LØPSDAG</span>}
                  {day.isToday && <span className="tag" style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid var(--green)44" }}>I DAG</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{day.note}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", minWidth: 80, textAlign: "right" }}>
                {day.isRace ? "🏁" : !day.isPast ? `35ml + 150ml vann` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="card">
        <div className="section-label">Viktige regler i opplastingsperioden</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["🚫", "Ingen antibakteriell munnskyll", "Listerine og lignende ødelegger effekten fullstendig. Vanlig tannpuss er OK."],
            ["🧊", "Server kald", "Rett fra kjøleskapet demper smaken merkbart."],
            ["🍎", "Bland med eplejuice", "Surheten overdøver jordsmaken. Unngå granateplejuice – kan interferere med opptak."],
            ["⚡", "Drikk raskt", "Ett svelg, ferdig. Ikke sipp på det."],
            ["🍽️", "Ikke på tom mage", "Et lite måltid i forkant reduserer risiko for kvalme, særlig med konsentratet."],
            ["⏱️", "2–3 timer før start", "På løpsdagen tas dosen 2–3 timer før pistolskudd. Nitratkonverteringen tar tid."],
            ["📋", "Bergen = prøverunde", "Dokumenter dose, timing og magereaksjon. Replikér nøyaktig på Berlin."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Science note */}
      <div className="card" style={{ borderColor: "var(--purple-dim)" }}>
        <div className="section-label">Hvorfor det virker</div>
        <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.8 }}>
          Nitrat fra rødbete konverteres av bakterier i munnen til nitrogenoksid (NO). NO utvider blodårene og forbedrer oksygenutnyttelsen i muskulaturen – særlig relevant ved intensiteter rundt og over terskel.
          <br /><br />
          Effekten er typisk <strong style={{ color: "var(--text)" }}>1–3% reduksjon i oksygenkostnad</strong>, tilsvarende 2–4 minutter på en maraton under ideelle betingelser.
          <br /><br />
          For deg er effekten størst i de siste 10–12 km av Berlin når du jobber tett på OBLA (HR ~174). Bergen gir deg en ekte prøve på toleranse og timing <strong style={{ color: "var(--text)" }}>før det gjelder.</strong>
        </div>
      </div>
    </div>
  );
}
