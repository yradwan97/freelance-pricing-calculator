import React from 'react';
import { fmt } from '../utils';
import styles from './RateSection.module.css';

export default function RateSection({ salary, setSalary, mult, setMult, buffer, setBuffer, ftHr, flHr, dayRate }) {
  return (
    <section className={styles.section}>
      <div className={styles.label}>01 — Base rate</div>
      <h2 className={styles.title}>Set your hourly rate</h2>

      <div className={styles.grid}>
        <SliderRow
          label="Monthly salary"
          min={5000} max={200000} step={500}
          value={salary}
          onChange={setSalary}
          display={`EGP ${salary.toLocaleString()}`}
          inputType="number"
        />
        <SliderRow
          label="Freelance multiplier"
          min={1.5} max={5} step={0.1}
          value={mult}
          onChange={setMult}
          display={`${mult.toFixed(1)}×`}
        />
        <SliderRow
          label="Scope buffer"
          min={0} max={60} step={5}
          value={buffer}
          onChange={setBuffer}
          display={`${buffer}%`}
        />
      </div>

      <div className={styles.metrics}>
        <MetricCard label="Fulltime hourly" value={fmt(ftHr)} />
        <MetricCard label="Freelance hourly" value={fmt(flHr)} accent />
        <MetricCard label="Day rate (8h)" value={fmt(dayRate)} />
      </div>
    </section>
  );
}

function SliderRow({ label, min, max, step, value, onChange, display, inputType }) {
  return (
    <div className={styles.row}>
      <label className={styles.rowLabel}>{label}</label>
      <div className={styles.sliderWrap}>
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
        />
      </div>
      {inputType === 'number' ? (
        <div className={styles.numWrap}>
          <span className={styles.currency}>EGP</span>
          <input
            type="number"
            className={styles.numInput}
            value={value}
            min={min} max={max} step={step}
            onChange={e => {
              const v = Math.min(Math.max(parseFloat(e.target.value) || min, min), max);
              onChange(v);
            }}
          />
        </div>
      ) : (
        <div className={styles.displayVal}>{display}</div>
      )}
    </div>
  );
}

function MetricCard({ label, value, accent }) {
  return (
    <div className={`${styles.metric} ${accent ? styles.accent : ''}`}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricVal}>{value}</div>
    </div>
  );
}
