import React from 'react';
import { COMPLEXITY_OPTIONS } from '../hooks/usePricing';
import styles from './ComplexitySection.module.css';

export default function ComplexitySection({ complexity, setComplexity }) {
  return (
    <section className={styles.section}>
      <div className={styles.label}>03 — Complexity</div>
      <h2 className={styles.title}>Project complexity level</h2>
      <div className={styles.grid}>
        {COMPLEXITY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`${styles.card} ${complexity === opt.value ? styles.active : ''}`}
            onClick={() => setComplexity(opt.value)}
          >
            <div className={styles.tag}>{opt.label}</div>
            <div className={styles.mult}>×{opt.value.toFixed(1)}</div>
            <div className={styles.desc}>{opt.desc}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
