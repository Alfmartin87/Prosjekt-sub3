@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

:root {
  --bg: #070709;
  --bg2: #0d0d12;
  --bg3: #13131a;
  --border: #1c1c28;
  --border2: #252535;
  --text: #e8e8f0;
  --text2: #a0a0c0;
  --text3: #7a7a9a;
  --blue: #3d6fff;
  --blue-dim: #1a2d6b;
  --amber: #f5a623;
  --amber-dim: #4a3008;
  --green: #2ecc71;
  --green-dim: #0d3d22;
  --red: #e74c3c;
  --red-dim: #3d1010;
  --purple: #9b59b6;
  --purple-dim: #2d1a3d;
  --teal: #1abc9c;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Mono', monospace;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.header {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  flex-direction: column;
  line-height: 1;
  gap: 1px;
}

.logo-main {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--text);
}

.logo-sub {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--blue);
}

.nav {
  display: flex;
  gap: 4px;
}

.nav-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text2);
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-btn:hover { color: var(--text); border-color: var(--border2); }
.nav-btn.active { background: var(--blue-dim); border-color: var(--blue); color: var(--blue); }
.nav-icon { font-size: 12px; }

/* MAIN */
.main {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  padding: 28px 24px 100px;
}

/* CARDS */
.card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 16px;
}

.card-sm {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
}

.section-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: var(--text3);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  text-transform: uppercase;
}

/* GRIDS */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; }

/* STAT BLOCKS */
.stat-block { }
.stat-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
}
.stat-unit {
  font-size: 12px;
  color: var(--text2);
  margin-left: 4px;
  font-family: 'DM Mono', monospace;
}
.stat-label {
  font-size: 10px;
  color: var(--text3);
  letter-spacing: 0.12em;
  margin-top: 4px;
  text-transform: uppercase;
}

/* TAGS */
.tag {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 3px;
  letter-spacing: 0.06em;
  font-family: 'DM Mono', monospace;
}

/* INPUTS */
input, textarea, select {
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  padding: 9px 12px;
  border-radius: 6px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
}
input:focus, textarea:focus { border-color: var(--blue); }
input[type=range] { padding: 0; border: none; background: transparent; cursor: pointer; accent-color: var(--blue); }
label {
  font-size: 10px;
  color: var(--text2);
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 5px;
  text-transform: uppercase;
}

/* BUTTONS */
.btn {
  background: var(--bg3);
  border: 1px solid var(--border2);
  color: var(--text2);
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  padding: 9px 18px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.btn:hover { border-color: var(--text3); color: var(--text); }
.btn-primary { background: var(--blue-dim); border-color: var(--blue); color: var(--blue); }
.btn-primary:hover { background: var(--blue); color: #fff; }
.btn-danger:hover { background: var(--red-dim); border-color: var(--red); color: var(--red); }

/* PROGRESS BARS */
.bar-track { background: var(--bg3); border-radius: 3px; height: 5px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

/* BOTTOM NAV - mobile only */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg2);
  border-top: 1px solid var(--border);
  z-index: 100;
  padding: 8px 0 env(safe-area-inset-bottom);
}

.bottom-nav-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text3);
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
  padding: 6px 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  transition: color 0.15s;
  text-transform: uppercase;
}
.bottom-nav-btn.active { color: var(--blue); }
.bottom-nav-icon { font-size: 18px; }
.bottom-nav-label { font-size: 9px; }

/* DIVIDER */
.divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

/* SCROLL */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

@media (max-width: 768px) {
  .header-inner { padding: 0 16px; }
  .nav { display: none; }
  .bottom-nav { display: flex; }
  .main { padding: 20px 16px 90px; }
  .grid-3 { grid-template-columns: 1fr 1fr; }
  .grid-4 { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 480px) {
  .grid-2 { grid-template-columns: 1fr; }
  .grid-3 { grid-template-columns: 1fr 1fr; }
}
