import React, { useState } from 'react';
import { fmt } from '../utils';
import styles from './ModulesSection.module.css';

export default function ModulesSection({ modules, flHr, toggleModule, updateModuleHrs, addModule, removeModule, selectAll, clearAll }) {
  const [showModal, setShowModal] = useState(false);
  const [newName,   setNewName]   = useState('');
  const [newHrs,    setNewHrs]    = useState('');
  const [nameErr,   setNameErr]   = useState(false);
  const [hrsErr,    setHrsErr]    = useState(false);

  function handleAdd() {
    const nameOk = newName.trim().length > 0;
    const hrsOk  = parseInt(newHrs, 10) > 0;
    setNameErr(!nameOk);
    setHrsErr(!hrsOk);
    if (!nameOk || !hrsOk) return;
    addModule(newName.trim(), newHrs);
    setNewName('');
    setNewHrs('');
    setShowModal(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') setShowModal(false);
  }

  return (
    <section className={styles.section}>
      <div className={styles.label}>02 — Project modules</div>
      <h2 className={styles.title}>Select &amp; configure modules</h2>

      <div className={styles.toolbar}>
        <button className={styles.btnSm} onClick={selectAll}>Select all</button>
        <button className={styles.btnSm} onClick={clearAll}>Clear all</button>
        <button className={`${styles.btnSm} ${styles.btnAdd}`} onClick={() => setShowModal(true)}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add module
        </button>
      </div>

      <div className={styles.list}>
        {modules.map(mod => (
          <div
            key={mod.id}
            className={`${styles.item} ${mod.active ? styles.active : ''}`}
            onClick={() => toggleModule(mod.id)}
          >
            <div className={styles.checkbox}>
              {mod.active && (
                <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <div className={styles.modName}>{mod.name}</div>
            <div className={styles.hrsWrap} onClick={e => e.stopPropagation()}>
              <input
                type="number"
                className={styles.hrsInput}
                value={mod.hrs}
                min={1} max={999}
                onChange={e => updateModuleHrs(mod.id, e.target.value)}
              />
              <span className={styles.hrsLabel}>hrs</span>
            </div>
            <div className={styles.cost}>{fmt(mod.hrs * flHr)}</div>
            <button
              className={styles.deleteBtn}
              title="Remove module"
              onClick={e => { e.stopPropagation(); removeModule(mod.id); }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add module modal */}
      {showModal && (
        <div className={styles.backdrop} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className={styles.modal} onKeyDown={handleKey}>
            <h3 className={styles.modalTitle}>Add module</h3>
            <div className={styles.field}>
              <label>Module name</label>
              <input
                type="text"
                placeholder="e.g. Admin panel"
                value={newName}
                onChange={e => { setNewName(e.target.value); setNameErr(false); }}
                className={nameErr ? styles.inputErr : ''}
                autoFocus
              />
              {nameErr && <span className={styles.errMsg}>Name is required</span>}
            </div>
            <div className={styles.field}>
              <label>Estimated hours</label>
              <input
                type="number"
                placeholder="e.g. 20"
                value={newHrs}
                min={1}
                onChange={e => { setNewHrs(e.target.value); setHrsErr(false); }}
                className={hrsErr ? styles.inputErr : ''}
              />
              {hrsErr && <span className={styles.errMsg}>Enter a valid number of hours</span>}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.btnSm} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={`${styles.btnSm} ${styles.btnPrimary}`} onClick={handleAdd}>Add module</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
