// src/components/Header.jsx
import React from 'react';
import styles from './Header.module.css';

export default function Header({ 
  onExport, exporting,
  clientName, setClientName, 
  projectName, setProjectName 
}) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.mark}>✦</span> DevPricer
        </div>

        <div className={styles.infoInputs}>
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={styles.input}
          />
        </div>

        <button className={styles.exportBtn} onClick={onExport} disabled={exporting}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          {exporting ? 'Generating…' : 'Export PDF'}
        </button>
      </div>
    </header>
  );
}