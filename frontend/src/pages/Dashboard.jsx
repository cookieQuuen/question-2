// Dashboard.jsx - Dark Industrial Cold-Chain Terminal Design
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x1441B1eea27Ac484D707970C16Ec0AAEdf4A0b6D";
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/dzT07dm6yihqSCAwkfUoX";
const ABI = ["function shipmentTemperatures(uint256) public view returns (uint256)"];

const Dashboard = () => {
  const [temp, setTemp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [pulse, setPulse] = useState(false);

  const fetchBlockchainData = async () => {
    try {
      setError(null);
      const provider = new ethers.JsonRpcProvider(RPC_URL, "sepolia");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const currentTemp = await contract.shipmentTemperatures(1);
      setTemp(Number(currentTemp));
      setLastUpdated(new Date());
      setIsLoading(false);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Node unreachable — check RPC connection");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (t) => {
    if (t === null) return {
      label: 'STANDBY', color: 'var(--text-muted)', borderColor: 'var(--border)',
      bg: 'transparent', icon: '◌', tier: 'neutral',
      message: 'Awaiting blockchain data...'
    };
    if (t > 39) return {
      label: 'CRITICAL BREACH', color: 'var(--red)', borderColor: 'rgba(255,59,92,0.5)',
      bg: 'rgba(255,59,92,0.06)', icon: '▲', tier: 'critical',
      message: 'Temperature exceeds V2 safety ceiling (39°C). Transaction rejected at contract level.'
    };
    if (t > 25) return {
      label: 'THRESHOLD WARNING', color: 'var(--amber)', borderColor: 'rgba(255,184,0,0.5)',
      bg: 'rgba(255,184,0,0.06)', icon: '◆', tier: 'warning',
      message: 'Approaching V2 limit. Review sensor calibration and shipment conditions.'
    };
    return {
      label: 'OPTIMAL', color: 'var(--green)', borderColor: 'var(--green-dim)',
      bg: 'var(--green-glow)', icon: '●', tier: 'ok',
      message: 'All cold-chain parameters within safe operating range.'
    };
  };

  const status = getStatus(temp);
  const safeTemp = temp ?? 0;
  const barPct = Math.min(100, (safeTemp / 50) * 100);

  const getBarColor = () => {
    if (temp === null) return 'var(--text-muted)';
    if (temp > 39) return 'var(--red)';
    if (temp > 25) return 'var(--amber)';
    return 'var(--green)';
  };

  const metrics = [
    { label: 'SHIPMENT ID', value: '#001', unit: '' },
    { label: 'NETWORK', value: 'SEPOLIA', unit: '' },
    { label: 'REFRESH', value: '10', unit: 's' },
    { label: 'CONTRACT', value: `${CONTRACT_ADDRESS.slice(0, 6)}···`, unit: '' },
  ];

  return (
    <div>
      <style>{`
        @keyframes tempPulse {
          0% { text-shadow: 0 0 0 transparent; }
          50% { text-shadow: 0 0 30px currentColor; }
          100% { text-shadow: 0 0 0 transparent; }
        }
        .temp-pulse { animation: tempPulse 0.6s ease; }

        @keyframes scanIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scan-in { animation: scanIn 0.4s ease forwards; }
        .scan-in-2 { animation: scanIn 0.4s 0.1s ease both; }
        .scan-in-3 { animation: scanIn 0.4s 0.2s ease both; }

        @keyframes barFill {
          from { width: 0%; }
        }
        .bar-animate { animation: barFill 1s ease forwards; }
      `}</style>

      {/* Page Header */}
      <div className="page-header scan-in">
        <span className="page-tag">// shipment monitoring · live</span>
        <h1 className="page-title">Live <span>Temperature</span> Feed</h1>
      </div>

      {/* Metrics Row */}
      <div className="card scan-in-2" style={{ padding: '1rem 1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {metrics.map((m, i) => (
            <div key={i} className="stat-block" style={{ borderRight: i < 3 ? '1px solid var(--border)' : 'none', paddingRight: i < 3 ? '1rem' : 0 }}>
              <span className="stat-label">{m.label}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'var(--ice)', marginTop: '0.2rem', display: 'block' }}>
                {m.value}<span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.2rem' }}>{m.unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid-2 scan-in-3" style={{ marginBottom: '1.25rem' }}>

        {/* Temperature Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">◉ Temperature Reading</span>
            <span className={`badge ${isLoading ? 'badge-ice' : 'badge-green'}`}>
              {isLoading ? 'FETCHING' : 'LIVE'}
            </span>
          </div>

          <div
            className={`temp-big ${pulse ? 'temp-pulse' : ''}`}
            style={{ color: getBarColor(), marginBottom: '0.5rem' }}
          >
            {isLoading ? '---' : `${safeTemp}`}
            <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>°C</span>
          </div>

          {/* Threshold markers */}
          <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
            <div className="progress-track">
              <div
                className="progress-fill bar-animate"
                style={{
                  width: `${barPct}%`,
                  background: `linear-gradient(90deg, var(--green), ${getBarColor()})`,
                  boxShadow: `0 0 8px ${getBarColor()}`
                }}
              />
            </div>
            {/* Threshold ticks */}
            <div style={{ position: 'relative', height: '14px', marginTop: '2px' }}>
              <span style={{
                position: 'absolute', left: `${(25 / 50) * 100}%`,
                fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--amber)',
                transform: 'translateX(-50%)', whiteSpace: 'nowrap'
              }}>▲25°</span>
              <span style={{
                position: 'absolute', left: `${(39 / 50) * 100}%`,
                fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--red)',
                transform: 'translateX(-50%)', whiteSpace: 'nowrap'
              }}>▲39°</span>
            </div>
          </div>

          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            SHIPMENT #001 · {lastUpdated
              ? `UPDATED ${lastUpdated.toLocaleTimeString('en-US', { hour12: false })} · AUTO-SYNC 10s`
              : 'PENDING...'
            }
          </div>
        </div>

        {/* Status Card */}
        <div className="card" style={{
          borderColor: status.borderColor,
          background: `linear-gradient(135deg, ${status.bg}, var(--bg-card))`,
          boxShadow: status.tier === 'critical' ? '0 0 20px rgba(255,59,92,0.1)' : 'none'
        }}>
          <div className="card-header">
            <span className="card-title">◈ Chain Status</span>
            {temp !== null && temp > 25 && (
              <span className="badge badge-amber">ACTION REQUIRED</span>
            )}
          </div>

          <div className="status-pill" style={{
            color: status.color,
            borderColor: status.borderColor,
            background: status.bg,
            marginBottom: '1rem',
            letterSpacing: '0.16em',
            boxShadow: `0 0 12px ${status.bg}`
          }}>
            <span>{status.icon}</span>
            <span>{status.label}</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {status.message}
          </p>

          {temp !== null && temp > 25 && (
            <button className="btn-danger" onClick={() => window.location.href = '/audit'}>
              ◬ VIEW AUDIT LOG →
            </button>
          )}

          {/* Legend */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { color: 'var(--green)', label: '0 – 25°C', desc: 'OPTIMAL' },
              { color: 'var(--amber)', label: '26 – 39°C', desc: 'WARNING' },
              { color: 'var(--red)', label: '> 39°C', desc: 'BREACH' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, boxShadow: `0 0 6px ${l.color}`, flexShrink: 0 }}></span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: l.color }}>{l.label}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{l.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Immutability Banner */}
      <div className="card" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '1.4rem', color: 'var(--ice)',
            background: 'var(--ice-glow)', width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '6px', border: '1px solid var(--border-bright)', flexShrink: 0
          }}>⬡</div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ice)', letterSpacing: '0.15em', marginBottom: '0.35rem' }}>
              IMMUTABLE RECORD PROTECTION
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Contract enforces <code style={{ fontFamily: 'var(--mono)', color: 'var(--ice)', background: 'var(--ice-glow)', padding: '0.1rem 0.35rem', borderRadius: '3px', fontSize: '0.78rem' }}>require(temp ≤ 25)</code> — any out-of-range reading is rejected before state mutation. Once recorded, no party can alter or delete on-chain data.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          ▲ {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
