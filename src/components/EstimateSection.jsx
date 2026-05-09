import React from 'react';
import { fmt } from '../utils';
import styles from './EstimateSection.module.css';

export default function EstimateSection({ estimate, complexity, complexityOption, buffer }) {
  const { active, totalHrs, rawCost, bufAmt, total } = estimate;

  return (
    <section className={styles.section} id="estimate-section">
      <div className={styles.label}>04 — Project estimate</div>
      <h2 className={styles.title}>Cost breakdown</h2>

      <div className={styles.box}>
        <div className={styles.modList}>
          {active.length === 0 ? (
            <p className={styles.empty}>No modules selected yet.</p>
          ) : (
            active.map(m => (
              <div key={m.id} className={styles.modRow}>
                <span className={styles.modName}>{m.name}</span>
                <span className={styles.modDetail}>{m.hrs} hrs · {fmt(m.hrs * (rawCost / totalHrs))}</span>
              </div>
            ))
          )}
        </div>

        <div className={styles.summary}>
          <SummaryRow label="Raw hours cost" value={`${fmt(rawCost)} (${totalHrs} hrs)`} />
          <SummaryRow label="Complexity multiplier" value={`${complexityOption?.label}  ×${complexity.toFixed(1)}`} />
          <SummaryRow label="Scope buffer" value={`+${buffer}%  →  ${fmt(bufAmt)}`} />
          <div className={`${styles.row} ${styles.total}`}>
            <span>Total project price</span>
            <span>{fmt(total)}</span>
          </div>
          <div className={styles.range}>
            Suggested range: {fmt(total * 0.88)} – {fmt(total * 1.15)}
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className={styles.row}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
