// Sensor.jsx - Dark Industrial Cold-Chain Terminal Design
import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x1441B1eea27Ac484D707970C16Ec0AAEdf4A0b6D";
const ABI = [
  "function updateStatus(uint256 shipmentId, uint256 temp) public",
  "function shipmentTemperatures(uint256) public view returns (uint256)"
];

const Sensor = ({ setAccount }) => {
  const [tempInput, setTempInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [txStatus, setTxStatus] = useState('idle');

  const validate = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return { valid: false, msg: 'Enter a valid number' };
    if (num < -50) return { valid: false, msg: 'Below -50°C — not realistic' };
    if (num > 100) return { valid: false, msg: 'Above 100°C — not realistic' };
    return { valid: true, value: num };
  };

  const getAdvice = (value) => {
    if (!value) return null;
    const v = validate(value);
    if (!v.valid) return { msg: v.msg, type: 'error' };
    const n = v.value;
    if (n > 25) return { msg: 'Will REVERT — exceeds 25°C threshold. Useful for Tenderly trace.', type: 'warning' };
    if (n > 20) return { msg: 'Safe range — transaction will be mined successfully.', type: 'success' };
    return { msg: 'Optimal cold-chain temperature.', type: 'success' };
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setTxHash(''); setSuccess(false);
    setTxStatus('pending');

    const v = validate(tempInput);
    if (!v.valid) { setError(v.msg); setTxStatus('error'); return; }
    if (!window.ethereum) { setError('MetaMask not detected. Install it to sign transactions.'); setTxStatus('error'); return; }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.updateStatus(1, tempInput);
      setTxHash(tx.hash);
      await tx.wait();
      setSuccess(true);
      setTxStatus('success');
      setLoading(false);
      setTempInput('');
      setTimeout(() => { setSuccess(false); setTxStatus('idle'); }, 6000);
    } catch (err) {
      setLoading(false);
      setTxStatus('error');
      const num = parseFloat(tempInput);
      if (num > 25) {
        setError(`TX REJECTED — require(temp ≤ 25) failed at contract level. Use Tenderly to inspect the revert trace.\n\n${err.message || 'Contract revert'}`);
      } else {
        setError(`Transaction failed: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const advice = getAdvice(tempInput);

  const adviceColor = advice
    ? advice.type === 'error' ? 'var(--red)'
      : advice.type === 'warning' ? 'var(--amber)'
      : 'var(--green)'
    : 'transparent';

  const inputBorder = advice
    ? advice.type === 'error' ? 'rgba(255,59,92,0.6)'
      : advice.type === 'warning' ? 'rgba(255,184,0,0.6)'
      : 'var(--green-dim)'
    : 'var(--border)';

  return (
    <div>
      <style>{`
        @keyframes scanIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scan-in { animation: scanIn 0.35s ease forwards; }
        .scan-in-2 { animation: scanIn 0.35s 0.1s ease both; }
        .scan-in-3 { animation: scanIn 0.35s 0.2s ease both; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          display: inline-block;
          width: 12px; height: 12px;
          border: 2px solid var(--bg-base);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .guide-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.875rem 0;
          border-bottom: 1px solid var(--border);
        }
        .guide-step:last-child { border-bottom: none; }

        .guide-num {
          font-family: var(--mono);
          font-size: 0.65rem;
          width: 28px; height: 28px;
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 1px solid;
          margin-top: 0.1rem;
        }
      `}</style>

      {/* Header */}
      <div className="page-header scan-in">
        <span className="page-tag">// iot sensor interface · manual override</span>
        <h1 className="page-title">Sensor <span>Control</span> Panel</h1>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>

        {/* Form */}
        <div className="card scan-in-2">
          <div className="card-header">
            <span className="card-title">◉ Push Temperature Reading</span>
            <span className="badge badge-ice">IOT SIM</span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Acting as an IoT oracle, this panel signs and broadcasts a temperature update to the Sepolia network. All readings are permanently inscribed on-chain.
          </p>

          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label className="input-label">Temperature Input (°C)</label>
              <input
                type="number"
                step="0.1"
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                placeholder="e.g. 22.5"
                className="input-field"
                required
                disabled={loading}
                style={{ borderColor: inputBorder, fontSize: '1.4rem', padding: '0.875rem 1rem' }}
              />
              {advice && (
                <div className="input-hint" style={{ color: adviceColor, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{advice.type === 'warning' ? '◆' : advice.type === 'error' ? '▲' : '●'}</span>
                  {advice.msg}
                </div>
              )}
            </div>

            {/* Preview */}
            {tempInput && !isNaN(parseFloat(tempInput)) && (
              <div style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                fontFamily: 'var(--mono)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                lineHeight: 1.8
              }}>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', letterSpacing: '0.1em' }}>TX PREVIEW</div>
                <div>contract.<span style={{ color: 'var(--ice)' }}>updateStatus</span>(<span style={{ color: 'var(--amber)' }}>1</span>, <span style={{ color: adviceColor }}>{tempInput}</span>)</div>
                <div>network: <span style={{ color: 'var(--green)' }}>sepolia</span></div>
                <div>gas: <span style={{ color: 'var(--text-secondary)' }}>estimated</span></div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', gap: '0.75rem' }}
            >
              {loading
                ? <><span className="spinner"></span> BROADCASTING TX...</>
                : <>⬡ SUBMIT TO BLOCKCHAIN</>
              }
            </button>
          </form>

          {/* TX States */}
          {txStatus === 'pending' && !success && !error && (
            <div className="alert alert-warning">
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                ◌ AWAITING CONFIRMATION...
              </div>
              {txHash && (
                <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="chain-link">
                  ↗ VIEW ON ETHERSCAN
                </a>
              )}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                ● BLOCK CONFIRMED — STATE UPDATED
              </div>
              {txHash && (
                <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="chain-link" style={{ color: 'var(--green)', borderColor: 'var(--green-dim)' }}>
                  ↗ VIEW TRANSACTION RECEIPT
                </a>
              )}
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                ▲ TX REVERTED
              </div>
              <div style={{ whiteSpace: 'pre-line', fontSize: '0.78rem' }}>{error}</div>
              {error.includes('require') && (
                <button
                  className="btn-danger"
                  style={{ marginTop: '0.75rem', fontSize: '0.7rem' }}
                  onClick={() => window.open('https://dashboard.tenderly.co/', '_blank')}
                >
                  ↗ OPEN TENDERLY FORENSICS
                </button>
              )}
            </div>
          )}
        </div>

        {/* Guidance Panel */}
        <div className="scan-in-3">
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-header">
              <span className="card-title">◬ Submission Guide</span>
            </div>

            <div className="guide-step">
              <div className="guide-num" style={{ color: 'var(--green)', borderColor: 'var(--green-dim)', background: 'var(--green-glow)' }}>01</div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--green)', marginBottom: '0.3rem', letterSpacing: '0.06em' }}>SUCCESS PATH</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Enter 15–25°C. Transaction mines on Sepolia and Dashboard syncs within one block.
                </p>
              </div>
            </div>

            <div className="guide-step">
              <div className="guide-num" style={{ color: 'var(--red)', borderColor: 'rgba(255,59,92,0.4)', background: 'rgba(255,59,92,0.06)' }}>02</div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--red)', marginBottom: '0.3rem', letterSpacing: '0.06em' }}>REVERT PATH · AUDIT REQ</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Enter &gt;25°C (e.g. 30). Contract <code style={{ fontFamily: 'var(--mono)', color: 'var(--ice)', fontSize: '0.75rem' }}>require()</code> fails — generates a Tenderly-traceable revert for Security Audit Category 4.
                </p>
              </div>
            </div>

            <div className="guide-step">
              <div className="guide-num" style={{ color: 'var(--ice)', borderColor: 'var(--border-bright)', background: 'var(--ice-glow)' }}>03</div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--ice)', marginBottom: '0.3rem', letterSpacing: '0.06em' }}>METAMASK REQUIRED</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Switch MetaMask to Sepolia testnet and ensure your wallet holds test ETH for gas.
                </p>
              </div>
            </div>
          </div>

          {/* MetaMask Status */}
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                METAMASK STATUS
              </span>
              {window.ethereum
                ? <span className="badge badge-green">DETECTED</span>
                : <span className="badge badge-red">NOT FOUND</span>
              }
            </div>
            {window.ethereum && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Network:{' '}
                <span style={{ color: window.ethereum.networkVersion === '11155111' ? 'var(--green)' : 'var(--amber)' }}>
                  {window.ethereum.networkVersion === '11155111' ? 'Sepolia ✓' : 'Switch to Sepolia'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sensor;
