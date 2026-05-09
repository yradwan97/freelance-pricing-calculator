import React from 'react';
import { fmt } from '../utils';
import { COMPLEXITY_OPTIONS, PAYMENT_TIPS } from '../hooks/usePricing';

const PAYMENTS = [
  { phase: 'Deposit',   pct: 0.30, note: 'Due before any work begins. Non-refundable.' },
  { phase: 'Milestone', pct: 0.40, note: 'Due on core feature delivery / working demo.', featured: true },
  { phase: 'Final',     pct: 0.30, note: 'Due on launch, handoff, or final acceptance.' },
];

export default function PrintView({ estimate, complexity, buffer, flHr, clientName, projectName }) {
  const { active, totalHrs, rawCost, bufAmt, total } = estimate;
  const complexityOption = COMPLEXITY_OPTIONS.find(o => o.value === complexity);
  const tip = PAYMENT_TIPS[complexity] || '';
  const generated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div id="print-view" style={{ display: 'none' }}>
      {/* Header */}
      <div className="print-header">
        <div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>✦ DevPricer</div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 2 }}>Freelance project estimate</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#888' }}>
          Generated: {generated}
        </div>
      </div>

      <div className="print-section">
        <div className="print-label">Client/Project</div>
        <div className="print-title">
          Client: {clientName} | Project: {projectName || "--------"}
        </div>
      </div>

      {/* Modules */}
      <div className="print-section">
        <div className="print-label">Project modules</div>
        <div className="print-title">Selected modules &amp; hours</div>
        {active.length === 0 ? (
          <p style={{ fontSize: '0.82rem', color: '#888' }}>No modules selected.</p>
        ) : (
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Module</th>
                <th style={{ textAlign: 'right' }}>Hours</th>
                <th style={{ textAlign: 'right' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {active.map(m => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{m.hrs}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{fmt(m.hrs * flHr)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ fontWeight: 700 }}>Total</td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'monospace' }}>{totalHrs}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'monospace' }}>{fmt(rawCost)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Estimate */}
      <div className="print-section">
        <div className="print-label">Project estimate</div>
        <div className="print-title">Cost breakdown</div>
        <div className="print-summary-row"><span>Raw hours cost</span><span style={{ fontFamily: 'monospace' }}>{fmt(rawCost)} ({totalHrs} hrs)</span></div>
        <div className="print-summary-row"><span>Complexity multiplier</span><span style={{ fontFamily: 'monospace' }}>{complexityOption?.label} ×{complexity.toFixed(1)}</span></div>
        <div className="print-summary-row"><span>Scope buffer</span><span style={{ fontFamily: 'monospace' }}>+{buffer}% → {fmt(bufAmt)}</span></div>
        <div className="print-summary-row total"><span>Total project price</span><span style={{ fontFamily: 'monospace' }}>{fmt(total)}</span></div>
        <div style={{ fontSize: '0.72rem', color: '#888', textAlign: 'right', marginTop: '0.3rem', fontFamily: 'monospace' }}>
          Suggested range: {fmt(total * 0.88)} – {fmt(total * 1.15)}
        </div>
      </div>

      {/* Payment */}
      <div className="print-section">
        <div className="print-label">Payment structure</div>
        <div className="print-title">Payment schedule</div>
        <div className="print-payment-grid">
          {PAYMENTS.map(({ phase, pct, note, featured }) => (
            <div key={phase} className={`print-payment-card ${featured ? 'featured' : ''}`}>
              <div className="print-pay-phase">{phase}</div>
              <div className="print-pay-pct">{Math.round(pct * 100)}%</div>
              <div className="print-pay-amount">{fmt(total * pct)}</div>
              <div className="print-pay-note">{note}</div>
            </div>
          ))}
        </div>
        {tip && <div className="print-tip">{tip}</div>}
      </div>
    </div>
  );
}
