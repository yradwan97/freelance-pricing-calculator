import React from 'react';
import { formatCurrency } from '../utils';
import styles from './EstimateSection.module.css';

export default function EstimateSection({ estimate, complexity, complexityOption, buffer, currency }) {
  const { active, totalHrs, rawCost, bufAmt, total } = estimate;
  const rate = totalHrs > 0 ? rawCost / totalHrs : 0;

  return (
    <section className={styles.section} id="estimate-section">
      <div className={styles.label}>04 — Project estimate</div>
      <h2 className={styles.title}>Cost breakdown</h2>

      <div className={styles.box}>
        <div className={styles.modList}>
          {active.length === 0 ? (
            <p className={styles.empty}>No modules selected yet.</p>
          ) : (
            active.map(m => {
              const subtasks = m.subtasks ?? [];
              return (
                <div key={m.id} className={styles.modGroup}>
                  <div className={styles.modRow}>
                    <span className={styles.modName}>{m.name}</span>
                    <span className={styles.modDetail}>
                      {m.hrs} hrs · {formatCurrency(m.hrs * rate, currency)}
                    </span>
                  </div>

                  {subtasks.length > 0 && (
                    <div className={styles.subList}>
                      {subtasks.map(t => (
                        <div key={t.id} className={styles.subRow}>
                          <span className={styles.subName}>{t.name || 'Untitled subtask'}</span>
                          <span className={styles.subDetail}>
                            {t.hrs} hrs · {formatCurrency(t.hrs * rate, currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className={styles.summary}>
          <SummaryRow label="Raw hours cost" value={`${formatCurrency(rawCost, currency)} (${totalHrs} hrs)`} />
          <SummaryRow label="Complexity multiplier" value={`${complexityOption?.label}  ×${complexity.toFixed(1)}`} />
          <SummaryRow label="Scope buffer" value={`+${buffer}%  →  ${formatCurrency(bufAmt, currency)}`} />
          <div className={`${styles.row} ${styles.total}`}>
            <span>Total project price</span>
            <span>{formatCurrency(total, currency)}</span>
          </div>
          <div className={styles.range}>
            Suggested range: {formatCurrency(total * 0.88, currency)} – {formatCurrency(total * 1.15, currency)}
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