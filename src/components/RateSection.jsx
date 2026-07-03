import React, { useState, useEffect } from 'react';
import { formatCurrency, CURRENCY_OPTIONS } from '../utils';
import styles from './RateSection.module.css';

export default function RateSection({ salary, setSalary, mult, setMult, buffer, setBuffer, currency, setCurrency, ftHr, flHr, dayRate, resetAllToDefaults }) {
  const [showMultInfo, setShowMultInfo] = useState(false);
  const [showBufferInfo, setShowBufferInfo] = useState(false);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <div className={styles.label}>01 — Base rate</div>
          <h2 className={styles.title}>Set your hourly rate</h2>
        </div>
        <button className={styles.resetBtn} onClick={resetAllToDefaults} title="Reset entire form to defaults">
          Reset Form
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.row}>
          <label className={styles.rowLabel}>Currency</label>
          <select
            className={styles.currencySelect}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCY_OPTIONS.map(opt => (
              <option key={opt.code} value={opt.code}>{opt.label}</option>
            ))}
          </select>
        </div>
        <SliderRow
          label="Monthly salary"
          min={10000} max={150000} step={500}
          value={salary}
          onChange={setSalary}
          display={formatCurrency(salary, currency)}
          inputType="number"
          currency={currency}
          debounceMs={600}
        />
        <SliderRow
          label="Freelance multiplier"
          min={1.5} max={5} step={0.1}
          value={mult}
          onChange={setMult}
          display={`${mult.toFixed(1)}×`}
          showInfo={showMultInfo}
          setShowInfo={setShowMultInfo}
          infoContent="Markup over your fulltime hourly rate. Accounts for overhead, irregular income, and increased value. Start at 2.5× for comfortable freelancing."
        />
        <SliderRow
          label="Scope buffer"
          min={0} max={60} step={5}
          value={buffer}
          onChange={setBuffer}
          display={`${buffer}%`}
          showInfo={showBufferInfo}
          setShowInfo={setShowBufferInfo}
          infoContent="Extra cost padding for scope creep and unforeseen complexity. 20-30% is typical. Protects you from underestimating."
        />
      </div>

      <div className={styles.metrics}>
        <MetricCard label="Fulltime hourly" value={formatCurrency(ftHr, currency)} />
        <MetricCard label="Freelance hourly" value={formatCurrency(flHr, currency)} accent />
        <MetricCard label="Day rate (8h)" value={formatCurrency(dayRate, currency)} />
      </div>
    </section>
  );
}

function SliderRow({ label, min, max, step, value, onChange, display, inputType, currency, debounceMs, showInfo, setShowInfo, infoContent }) {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    if (!debounceMs) return;

    const timeoutId = setTimeout(() => {
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        const validated = Math.max(min, parsed);
        onChange(validated);
        setInputValue(String(validated));
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [inputValue, debounceMs, onChange, min]);

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <div className={styles.row}>
      <div
        className={styles.labelWrap}
        onMouseEnter={() => setShowInfo?.(true)}
        onMouseLeave={() => setShowInfo?.(false)}
      >
        <label className={styles.rowLabel}>{label}</label>
        {infoContent && (
          <button
            className={styles.infoBtn}
            title="More info"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>
        )}
      </div>
      {showInfo && infoContent && (
        <div
          className={styles.popover}
          onMouseEnter={() => setShowInfo?.(true)}
          onMouseLeave={() => setShowInfo?.(false)}
        >
          {infoContent}
        </div>
      )}
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
          <span className={styles.currency}>{currency}</span>
          <input
            type="number"
            className={styles.numInput}
            value={inputValue}
            step={step}
            onChange={e => setInputValue(e.target.value)}
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
