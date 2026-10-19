import React, { useState } from "react";
import { formatCurrency } from "../utils";
import styles from "./ModulesSection.module.css";

export default function ModulesSection({
  modules,
  flHr,
  currency,
  toggleModule,
  updateModuleHrs,
  addModule,
  removeModule,
  selectAll,
  clearAll,
  addSubtask,
  updateSubtask,
  removeSubtask,
}) {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHrs, setNewHrs] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [hrsErr, setHrsErr] = useState(false);
  const [focusId, setFocusId] = useState(null);

  function handleAdd() {
    const nameOk = newName.trim().length > 0;
    const hrsOk = parseFloat(newHrs) > 0;
    setNameErr(!nameOk);
    setHrsErr(!hrsOk);
    if (!nameOk || !hrsOk) return;
    addModule(newName.trim(), newHrs);
    setNewName("");
    setNewHrs("");
    setShowModal(false);
  }

  function handleKey(e) {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") setShowModal(false);
  }

  return (
    <section className={styles.section}>
      <div className={styles.label}>02 — Project modules</div>
      <h2 className={styles.title}>Select &amp; configure modules</h2>

      <div className={styles.toolbar}>
        <button className={styles.btnSm} onClick={selectAll}>
          Select all
        </button>
        <button className={styles.btnSm} onClick={clearAll}>
          Clear all
        </button>
        <button
          className={`${styles.btnSm} ${styles.btnAdd}`}
          onClick={() => setShowModal(true)}
        >
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add module
        </button>
      </div>

      <div className={styles.list}>
        {modules.map((mod) => {
          const subtasks = mod.subtasks ?? [];
          const hasSubtasks = subtasks.length > 0;

          return (
            <div key={mod.id} className={styles.moduleBlock}>
              <div
                className={`${styles.item} ${mod.active ? styles.active : ""}`}
                onClick={() => toggleModule(mod.id)}
              >
                <div className={styles.checkbox}>
                  {mod.active && (
                    <svg
                      width="9"
                      height="9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                <div className={styles.modName}>
                  <span className={styles.modNameText}>{mod.name}</span>
                </div>

                <div
                  className={styles.hrsWrap}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.addSubBtn}
                    title="Add subtask"
                    onClick={() => setFocusId(addSubtask(mod.id))}
                  >
                    <svg
                      width="11"
                      height="11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    className={styles.hrsInput}
                    value={mod.hrs}
                    min={0.5}
                    max={999}
                    step={0.5}
                    disabled={hasSubtasks}
                    title={hasSubtasks ? "Calculated from subtasks" : undefined}
                    onChange={(e) => updateModuleHrs(mod.id, e.target.value)}
                  />
                  <span className={styles.hrsLabel}>hrs</span>
                </div>

                <div className={styles.cost}>
                  {formatCurrency(mod.hrs * flHr, currency)}
                </div>

                <button
                  className={styles.deleteBtn}
                  title="Remove module"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeModule(mod.id);
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {hasSubtasks && (
                <div className={styles.subPanel}>
                  {subtasks.map((t) => (
                    <div key={t.id} className={styles.subRow}>
                      <input
                        type="text"
                        className={styles.subName}
                        placeholder="Subtask name"
                        value={t.name}
                        autoFocus={t.id === focusId}
                        onBlur={() => t.id === focusId && setFocusId(null)}
                        onChange={(e) =>
                          updateSubtask(mod.id, t.id, "name", e.target.value)
                        }
                      />
                      <div className={styles.hrsWrap}>
                        <input
                          type="number"
                          className={styles.hrsInput}
                          value={t.hrs}
                          min={0.5}
                          max={999}
                          step={0.5}
                          onChange={(e) =>
                            updateSubtask(mod.id, t.id, "hrs", e.target.value)
                          }
                        />
                        <span className={styles.hrsLabel}>hrs</span>
                      </div>
                      <div className={styles.cost}>
                        {formatCurrency(t.hrs * flHr, currency)}
                      </div>
                      <button
                        className={styles.deleteBtn}
                        title="Remove subtask"
                        onClick={() => removeSubtask(mod.id, t.id)}
                      >
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add module modal */}
      {showModal && (
        <div
          className={styles.backdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className={styles.modal} onKeyDown={handleKey}>
            <h3 className={styles.modalTitle}>Add module</h3>
            <div className={styles.field}>
              <label>Module name</label>
              <input
                type="text"
                placeholder="e.g. Admin panel"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNameErr(false);
                }}
                className={nameErr ? styles.inputErr : ""}
                autoFocus
              />
              {nameErr && (
                <span className={styles.errMsg}>Name is required</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Estimated hours</label>
              <input
                type="number"
                placeholder="e.g. 20"
                value={newHrs}
                min={0.5}
                step={0.5}
                onChange={(e) => {
                  setNewHrs(e.target.value);
                  setHrsErr(false);
                }}
                className={hrsErr ? styles.inputErr : ""}
              />
              {hrsErr && (
                <span className={styles.errMsg}>
                  Enter a valid number of hours
                </span>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.btnSm}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`${styles.btnSm} ${styles.btnPrimary}`}
                onClick={handleAdd}
              >
                Add module
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}