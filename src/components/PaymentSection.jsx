import React from 'react';
import { fmt } from '../utils';
import { PAYMENT_TIPS } from '../hooks/usePricing';
import styles from './PaymentSection.module.css';

const PAYMENTS = [
  { phase: 'Deposit',   pct: 0.30, note: 'Due before any work begins. Non-refundable.' },
  { phase: 'Milestone', pct: 0.40, note: 'Due on core feature delivery / working demo.', featured: true },
  { phase: 'Final',     pct: 0.30, note: 'Due on launch, handoff, or final acceptance.' },
];

export default function PaymentSection({ total, complexity }) {
  const tip = PAYMENT_TIPS[complexity] || '';

  return (
    <section className={styles.section}>
      <div className={styles.label}>05 — Payment structure</div>
      <h2 className={styles.title}>Payment schedule</h2>

      <div className={styles.grid}>
        {PAYMENTS.map(({ phase, pct, note, featured }) => (
          <div key={phase} className={`${styles.card} ${featured ? styles.featured : ''}`}>
            {featured && <div className={styles.badge}>recommended</div>}
            <div className={styles.phase}>{phase}</div>
            <div className={styles.pct}>{Math.round(pct * 100)}%</div>
            <div className={styles.amount}>{fmt(total * pct)}</div>
            <div className={styles.note}>{note}</div>
          </div>
        ))}
      </div>

      <div className={styles.tip}>{tip}</div>
    </section>
  );
}
