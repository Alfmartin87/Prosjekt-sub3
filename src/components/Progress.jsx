import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const ACHILLES_COLORS = ["", "#2ecc71", "#a3e635", "#facc15", "#fb923c", "#e74c3c"];
const ACHILLES_LABELS = ["", "Smertefri", "Litt stiv morgen", "Stiv + merkbar", "Smerter under løp", "Måtte stoppe"];

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("nb-NO", { day: "numeric", month: "numeric" });
}

function efficiency(w) {
  if (!w.stryd?.avgPower || !w.longRunPace) return null;
  const p = w.longRunPace.split(":");
  if (p.length !== 2) return null;
  const spd = 3600 / (parseInt(p[0]) * 60 + parseInt(p[1]));
  return parseFloat((Number(w.stryd.avgPower) / spd).toFixed(1));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 6, padding: "8px 12px", fontSize: 11, color: "var(--text)" }}>
      <div style={{ color: "var(--text3)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function Progress({ weeks }) {
  if (weeks.length < 2) {
    return (
      <div style={{ textAlign: "center", color: "var(--text3)", padding: "80px 0", fontSize: 13 }}>
        Logg minst 2 uker for å se fremgang
      </div>
    );
  }

  const chartData = weeks.slice(0, 10).slice().reverse().map(w => ({
    date: fmtDate(w.weekStart),
    km: Number(w.totalKm) || 0,
    tss: Number(w.tss) || 0,
    watt: Number(w.stryd?.avgPower) || 0,
    hrv: Number(w.hrv) || 0,
    sleep: Number(w.sleepHours) || 0,
    easy: Number(w.intensityDistribution?.easy) || 0,
    hard: Number(w.intensityDistribution?.hard) || 0,
    eff: efficiency(w) || 0,
    achilles: Number(w.achilles) || 1,
  }));

  return (
    <div>
      {/* Volume + TSS */}
      <div className="card">
        <div className="section-label">Ukentlig volum (km)</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="#3d6fff33" strokeDasharray="4 4" />
            <ReferenceLine y={85} stroke="#3d6fff22" strokeDasharray="4 4" />
            <Bar dataKey="km" fill="#3d6fff" name="km" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>Stiplet linje = sub-3 målsone 70–85 km</div>
      </div>

      {/* Watt trend */}
      {chartData.some(d => d.watt > 0) && (
        <div className="card">
          <div className="section-label">Snitt watt per uke</div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={250} stroke="#f5a62333" strokeDasharray="4 4" />
              <ReferenceLine y={270} stroke="#f5a62322" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="watt" stroke="var(--amber)" strokeWidth={2} dot={{ fill: "var(--amber)", r: 3 }} name="W" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>Stiplet linje = langtur-målsone 250–270W</div>
        </div>
      )}

      {/* HRV + Sleep side by side */}
      <div className="grid-2">
        {chartData.some(d => d.hrv > 0) && (
          <div className="card">
            <div className="section-label">HRV-trend</div>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={80} stroke="#2ecc7133" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="hrv" stroke="var(--teal)" strokeWidth={2} dot={{ fill: "var(--teal)", r: 3 }} name="HRV" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartData.some(d => d.sleep > 0) && (
          <div className="card">
            <div className="section-label">Søvn (timer)</div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={7.5} stroke="#2ecc7133" strokeDasharray="3 3" />
                <Bar dataKey="sleep" fill="var(--green)" name="timer" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Efficiency */}
      {chartData.some(d => d.eff > 0) && (
        <div className="card">
          <div className="section-label">Løpsøkonomi – W/km·h i langturspace (lavere = bedre)</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={chartData.filter(d => d.eff > 0)} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} reversed />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="eff" stroke="var(--amber)" strokeWidth={2} dot={{ fill: "var(--amber)", r: 3 }} name="W/kmh" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>Y-aksen er reversert – kurve som går opp betyr bedre økonomi</div>
        </div>
      )}

      {/* Akilles heatmap */}
      <div className="card">
        <div className="section-label">Akilles-status per uke</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {weeks.slice(0, 12).slice().reverse().map((w, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                width: 42, height: 42, borderRadius: 6,
                background: ACHILLES_COLORS[w.achilles] + "22",
                border: `1px solid ${ACHILLES_COLORS[w.achilles]}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Barlow Condensed'", fontSize: 18, fontWeight: 700,
                color: ACHILLES_COLORS[w.achilles],
              }}>{w.achilles}</div>
              <div style={{ fontSize: 8, color: "var(--text3)", marginTop: 3 }}>{fmtDate(w.weekStart)}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5].map(v => (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: ACHILLES_COLORS[v] }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: ACHILLES_COLORS[v] }} />
              {v} – {ACHILLES_LABELS[v]}
            </div>
          ))}
        </div>
      </div>

      {/* Intensity distribution */}
      {chartData.some(d => d.easy > 0) && (
        <div className="card">
          <div className="section-label">Intensitetsfordeling per uke</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#2ecc7133" strokeDasharray="3 3" />
              <Bar dataKey="easy" fill="var(--green)" name="% Easy" stackId="a" />
              <Bar dataKey="hard" fill="var(--red)" name="% Hard" stackId="a" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>Grønn = easy (sone 1-2) · Rød = hard (sone 3+) · Stiplet = 80% easy-mål</div>
        </div>
      )}
    </div>
  );
}
