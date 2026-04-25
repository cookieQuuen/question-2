// Layout.jsx - Dark Industrial Cold-Chain Terminal Design
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children, account, onConnect }) => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 8000);
    return () => clearInterval(glitchTimer);
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '◈', tag: 'LIVE', description: 'Temperature Monitor' },
    { path: '/sensor', label: 'Sensor Control', icon: '◉', tag: 'IOT', description: 'Submit Readings' },
    { path: '/audit', label: 'Audit & Security', icon: '◬', tag: 'SEC', description: 'Forensic Analysis' }
  ];

  const isConnected = account && account !== 'Not Connected';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-base: #040d18;
          --bg-panel: #071525;
          --bg-card: #0a1e35;
          --bg-elevated: #0d2440;
          --border: rgba(0, 180, 255, 0.12);
          --border-bright: rgba(0, 180, 255, 0.35);
          --ice: #00b4ff;
          --ice-dim: rgba(0, 180, 255, 0.6);
          --ice-glow: rgba(0, 180, 255, 0.15);
          --green: #00ff9d;
          --green-dim: rgba(0, 255, 157, 0.6);
          --green-glow: rgba(0, 255, 157, 0.12);
          --amber: #ffb800;
          --red: #ff3b5c;
          --text-primary: #e8f4ff;
          --text-secondary: #7aabcc;
          --text-muted: #3a6080;
          --mono: 'Share Tech Mono', monospace;
          --sans: 'Exo 2', sans-serif;
        }

        body {
          background: var(--bg-base);
          color: var(--text-primary);
          font-family: var(--sans);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Scanline overlay */
        body::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          );
          pointer-events: none;
          z-index: 9999;
        }

        /* ── LAYOUT ── */
        .layout-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* ── HEADER ── */
        .app-header {
          height: 64px;
          background: var(--bg-panel);
          border-bottom: 1px solid var(--border-bright);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 0 30px rgba(0, 180, 255, 0.08);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon-wrap {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--ice), #0066ff);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          box-shadow: 0 0 20px rgba(0, 180, 255, 0.4);
          position: relative;
        }

        .logo-icon-wrap::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 10px;
          border: 1px solid rgba(0, 180, 255, 0.4);
        }

        .logo-text {
          font-family: var(--mono);
          font-size: 1.1rem;
          letter-spacing: 0.15em;
          color: var(--ice);
          text-shadow: 0 0 20px rgba(0, 180, 255, 0.5);
        }

        .logo-text.glitch {
          animation: glitch 0.15s steps(2) forwards;
        }

        @keyframes glitch {
          0% { text-shadow: 2px 0 var(--red), -2px 0 var(--ice); clip-path: inset(10% 0 80% 0); }
          33% { text-shadow: -2px 0 var(--green), 2px 0 var(--red); clip-path: inset(50% 0 30% 0); }
          66% { text-shadow: 1px 0 var(--ice), -1px 0 var(--green); clip-path: inset(80% 0 5% 0); }
          100% { text-shadow: 0 0 20px rgba(0, 180, 255, 0.5); clip-path: inset(0); }
        }

        .logo-sub {
          font-size: 0.6rem;
          color: var(--text-muted);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: var(--mono);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-clock {
          font-family: var(--mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
          background: var(--bg-card);
          border: 1px solid var(--border);
          padding: 0.3rem 0.75rem;
          border-radius: 4px;
          letter-spacing: 0.1em;
        }

        .network-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-bright);
          padding: 0.3rem 0.75rem;
          border-radius: 4px;
          font-size: 0.72rem;
          font-family: var(--mono);
          color: var(--green);
          letter-spacing: 0.08em;
        }

        .net-dot {
          width: 6px;
          height: 6px;
          background: var(--green);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--green);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .wallet-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid var(--border-bright);
          color: var(--ice);
          padding: 0.35rem 1rem;
          border-radius: 4px;
          font-family: var(--mono);
          font-size: 0.75rem;
          cursor: pointer;
          letter-spacing: 0.08em;
          transition: all 0.2s;
        }

        .wallet-btn:hover {
          background: var(--ice-glow);
          border-color: var(--ice);
          box-shadow: 0 0 12px rgba(0, 180, 255, 0.2);
        }

        .wallet-btn.connected {
          border-color: var(--green);
          color: var(--green);
        }

        .wallet-btn.connected:hover {
          background: var(--green-glow);
          box-shadow: 0 0 12px rgba(0, 255, 157, 0.2);
        }

        /* ── BODY ── */
        .layout-body {
          display: flex;
          flex: 1;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: 220px;
          background: var(--bg-panel);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
          flex-shrink: 0;
        }

        .sidebar-label {
          font-family: var(--mono);
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: var(--text-muted);
          padding: 0 1.25rem;
          margin-bottom: 0.75rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          text-decoration: none;
          color: var(--text-secondary);
          border-left: 2px solid transparent;
          transition: all 0.2s;
          position: relative;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(0, 180, 255, 0.05);
          border-left-color: var(--ice-dim);
        }

        .nav-link.active {
          color: var(--ice);
          background: var(--ice-glow);
          border-left-color: var(--ice);
        }

        .nav-icon-box {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          border-radius: 6px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .nav-link.active .nav-icon-box {
          background: var(--ice-glow);
          border-color: var(--ice-dim);
          color: var(--ice);
          box-shadow: 0 0 12px rgba(0, 180, 255, 0.15);
        }

        .nav-text { flex: 1; }

        .nav-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .nav-desc {
          display: block;
          font-size: 0.65rem;
          color: var(--text-muted);
          font-family: var(--mono);
          margin-top: 0.1rem;
        }

        .nav-tag {
          font-family: var(--mono);
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          padding: 0.1rem 0.35rem;
          border-radius: 2px;
        }

        .nav-link.active .nav-tag {
          color: var(--ice);
          border-color: var(--border-bright);
        }

        .sidebar-bottom {
          margin-top: auto;
          padding: 1rem 1.25rem 0;
          border-top: 1px solid var(--border);
        }

        .sys-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--mono);
          font-size: 0.65rem;
          color: var(--green);
          margin-bottom: 0.5rem;
        }

        .sys-dot {
          width: 5px; height: 5px;
          background: var(--green);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--green);
          animation: pulse 2s infinite;
        }

        .version-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--mono);
          font-size: 0.6rem;
          color: var(--text-muted);
        }

        /* ── MAIN ── */
        .main-area {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          background: 
            radial-gradient(ellipse at 10% 0%, rgba(0, 60, 120, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 90% 100%, rgba(0, 40, 80, 0.12) 0%, transparent 60%),
            var(--bg-base);
        }

        .content-wrap {
          max-width: 900px;
          margin: 0 auto;
        }

        /* ── FOOTER ── */
        .app-footer {
          background: var(--bg-panel);
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          padding: 0.6rem 1.5rem;
        }

        .footer-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--mono);
          font-size: 0.62rem;
          color: var(--text-muted);
          letter-spacing: 0.08em;
        }

        .footer-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--ice-dim);
        }

        /* ── SHARED PAGE STYLES ── */
        .page-header {
          margin-bottom: 2rem;
        }

        .page-tag {
          font-family: var(--mono);
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          color: var(--ice);
          text-transform: uppercase;
          margin-bottom: 0.4rem;
          display: block;
        }

        .page-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .page-title span {
          color: var(--ice);
        }

        /* ── CARDS ── */
        .card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--ice-dim), transparent);
          opacity: 0.5;
        }

        .card:hover { border-color: var(--border-bright); }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .card-title {
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-family: var(--mono);
        }

        /* ── BADGES ── */
        .badge {
          font-family: var(--mono);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          padding: 0.2rem 0.6rem;
          border-radius: 2px;
          border: 1px solid;
          text-transform: uppercase;
        }

        .badge-green { color: var(--green); border-color: var(--green-dim); background: var(--green-glow); }
        .badge-ice { color: var(--ice); border-color: var(--ice-dim); background: var(--ice-glow); }
        .badge-amber { color: var(--amber); border-color: rgba(255,184,0,0.5); background: rgba(255,184,0,0.08); }
        .badge-red { color: var(--red); border-color: rgba(255,59,92,0.5); background: rgba(255,59,92,0.08); }

        /* ── GRID ── */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

        /* ── DIVIDER ── */
        .divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1.5rem 0;
        }

        /* ── TEMP DISPLAY ── */
        .temp-big {
          font-family: var(--mono);
          font-size: 3.5rem;
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        /* ── STATUS PILL ── */
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1rem;
          border-radius: 2px;
          border: 1px solid;
          font-family: var(--mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          font-weight: 700;
        }

        /* ── PROGRESS BAR ── */
        .progress-track {
          height: 4px;
          background: var(--bg-elevated);
          border-radius: 2px;
          overflow: hidden;
          margin: 0.75rem 0;
        }

        .progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s ease;
        }

        /* ── BUTTON ── */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--ice);
          color: var(--bg-base);
          border: none;
          padding: 0.65rem 1.5rem;
          border-radius: 4px;
          font-family: var(--mono);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .btn-primary:hover {
          background: #33c7ff;
          box-shadow: 0 0 20px rgba(0, 180, 255, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: var(--ice);
          border: 1px solid var(--border-bright);
          padding: 0.55rem 1.25rem;
          border-radius: 4px;
          font-family: var(--mono);
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .btn-ghost:hover {
          background: var(--ice-glow);
          box-shadow: 0 0 12px rgba(0, 180, 255, 0.15);
        }

        .btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: var(--red);
          border: 1px solid rgba(255,59,92,0.4);
          padding: 0.55rem 1.25rem;
          border-radius: 4px;
          font-family: var(--mono);
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .btn-danger:hover {
          background: rgba(255,59,92,0.08);
          box-shadow: 0 0 12px rgba(255,59,92,0.15);
        }

        /* ── INPUT ── */
        .input-group { margin-bottom: 1.25rem; }

        .input-label {
          display: block;
          font-family: var(--mono);
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          color: var(--text-secondary);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .input-field {
          width: 100%;
          background: var(--bg-base);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 0.75rem 1rem;
          border-radius: 4px;
          font-family: var(--mono);
          font-size: 1rem;
          letter-spacing: 0.05em;
          transition: all 0.2s;
          outline: none;
        }

        .input-field:focus {
          border-color: var(--ice);
          box-shadow: 0 0 0 2px rgba(0, 180, 255, 0.1);
        }

        .input-field::placeholder { color: var(--text-muted); }

        .input-hint {
          font-family: var(--mono);
          font-size: 0.68rem;
          margin-top: 0.4rem;
          letter-spacing: 0.04em;
        }

        /* ── ALERTS ── */
        .alert {
          border-radius: 4px;
          padding: 0.875rem 1rem;
          border-left: 3px solid;
          margin-top: 1rem;
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .alert-success {
          background: var(--green-glow);
          border-color: var(--green);
          color: var(--green);
        }

        .alert-warning {
          background: rgba(255, 184, 0, 0.08);
          border-color: var(--amber);
          color: var(--amber);
        }

        .alert-error {
          background: rgba(255, 59, 92, 0.08);
          border-color: var(--red);
          color: var(--red);
        }

        .alert-info {
          background: var(--ice-glow);
          border-color: var(--ice);
          color: var(--ice);
        }

        /* ── MONO TEXT ── */
        .mono { font-family: var(--mono); }
        .text-ice { color: var(--ice); }
        .text-green { color: var(--green); }
        .text-amber { color: var(--amber); }
        .text-red { color: var(--red); }
        .text-muted { color: var(--text-muted); }
        .text-secondary { color: var(--text-secondary); }

        /* ── CODE BLOCK ── */
        .code-block {
          background: #020b16;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 1rem;
          font-family: var(--mono);
          font-size: 0.78rem;
          line-height: 1.6;
          overflow-x: auto;
        }

        /* ── TAB BAR ── */
        .tab-bar {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }

        .tab-btn {
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-muted);
          padding: 0.6rem 1.25rem;
          font-family: var(--mono);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: -1px;
        }

        .tab-btn:hover { color: var(--text-secondary); }

        .tab-btn.active {
          color: var(--ice);
          border-bottom-color: var(--ice);
        }

        /* ── STAT BLOCK ── */
        .stat-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-family: var(--mono);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .stat-value {
          font-family: var(--mono);
          font-size: 1.6rem;
          color: var(--text-primary);
          line-height: 1;
        }

        .stat-unit {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-left: 0.25rem;
        }

        /* scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg-base); }
        ::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 2px; }

        /* link */
        a.chain-link {
          color: var(--ice);
          text-decoration: none;
          font-family: var(--mono);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--ice-dim);
          transition: color 0.2s;
        }
        a.chain-link:hover { color: #33c7ff; }
      `}</style>

      <div className="layout-root">
        {/* Header */}
        <header className="app-header">
          <div className="logo-section">
            <div className="logo-icon-wrap">❄</div>
            <div>
              <div className={`logo-text ${glitch ? 'glitch' : ''}`}>COLDCHAIN PRO</div>
              <div className="logo-sub">Immutable Cold Logistics</div>
            </div>
          </div>

          <div className="header-right">
            <div className="header-clock mono">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="network-pill">
              <span className="net-dot"></span>
              SEPOLIA · LIVE
            </div>
            <button
              className={`wallet-btn ${isConnected ? 'connected' : ''}`}
              onClick={onConnect}
            >
              {isConnected
                ? `⬡ ${account.slice(0, 6)}···${account.slice(-4)}`
                : '⬡ CONNECT WALLET'
              }
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="layout-body">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-label">// navigation</div>
            <nav>
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-icon-box">{item.icon}</div>
                    <div className="nav-text">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-desc">{item.description}</span>
                    </div>
                    <span className="nav-tag">{item.tag}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="sidebar-bottom">
              <div className="sys-status">
                <span className="sys-dot"></span>
                SYSTEM OPERATIONAL
              </div>
              <div className="version-row">
                <span>v2.0.0</span>
                <span>ENTERPRISE</span>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="main-area">
            <div className="content-wrap">
              {children}
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          {[
            '🔒 Blockchain Secured',
            '⚡ Real-time Monitoring',
            '📊 24/7 Analytics',
            '🛡 Audited Contract'
          ].map((item, i) => (
            <div key={i} className="footer-item">
              <span className="footer-dot"></span>
              {item}
            </div>
          ))}
        </footer>
      </div>
    </>
  );
};

export default Layout;
