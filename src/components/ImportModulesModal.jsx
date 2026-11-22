import React, { useEffect, useMemo, useRef, useState } from "react";
import { readWorkbook, extractModules, downloadTemplate } from "../importModules";
import styles from "./ImportModulesModal.module.css";

const MODES = [
  { value: "append", label: "Add to existing modules" },
  { value: "merge", label: "Update matching names, add the rest" },
  { value: "replace", label: "Replace all modules" },
];

export default function ImportModulesModal({ onClose, onImport }) {
  const inputRef = useRef(null);
  const [wb, setWb] = useState(null);
  const [fileName, setFileName] = useState("");
  const [sheet, setSheet] = useState("");
  const [mode, setMode] = useState("append");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const parsed = useMemo(
    () => (wb && sheet ? extractModules(wb.sheets[sheet] ?? []) : null),
    [wb, sheet]
  );

  async function handleFile(file) {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const data = await readWorkbook(file);
      if (!data.sheetNames.length) throw new Error("No sheets found");
      // pre-select the first sheet that actually yields modules
      const best =
        data.sheetNames.find((n) => extractModules(data.sheets[n]).items.length > 0) ??
        data.sheetNames[0];
      setWb(data);
      setSheet(best);
      setFileName(file.name);
    } catch (err) {
      console.error(err);
      setWb(null);
      setError("Couldn't read that file. Use .xlsx, .xls or .csv.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const items = parsed?.items ?? [];
  const total = items.reduce((s, m) => s + m.hrs, 0);

  function confirm() {
    if (!items.length) return;
    onImport(items, mode);
    onClose();
  }

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label="Import modules from Excel">
        <h3 className={styles.title}>Import modules from Excel</h3>
        <p className={styles.hint}>
          Columns: <b>Name</b> + <b>Hours</b>, or <b>Module</b> + <b>Task</b> + <b>Hours</b> to create
          subtasks.{" "}
          <button type="button" className={styles.link} onClick={downloadTemplate}>
            Download template
          </button>
        </p>

        <label className={styles.drop}>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {busy ? "Reading…" : fileName ? `📄 ${fileName} (click to change)` : "Choose an .xlsx / .xls / .csv file"}
        </label>

        {error && <div className={styles.error}>{error}</div>}

        {wb && (
          <>
            {wb.sheetNames.length > 1 && (
              <div className={styles.row}>
                <label htmlFor="imp-sheet">Sheet</label>
                <select id="imp-sheet" value={sheet} onChange={(e) => setSheet(e.target.value)}>
                  {wb.sheetNames.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}

            {items.length === 0 ? (
              <div className={styles.error}>
                No valid rows on this sheet. It needs a name column and an hours column with values above 0.
              </div>
            ) : (
              <>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr><th>Module</th><th>Subtasks</th><th>Hrs</th></tr>
                    </thead>
                    <tbody>
                      {items.map((m, i) => (
                        <tr key={i}>
                          <td>{m.name}</td>
                          <td>{m.subtasks?.length ?? "—"}</td>
                          <td>{m.hrs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.summary}>
                  {items.length} module{items.length === 1 ? "" : "s"} · {Math.round(total * 100) / 100} hrs
                </div>
              </>
            )}

            {parsed?.skipped.length > 0 && (
              <details className={styles.warn}>
                <summary>{parsed.skipped.length} row(s) skipped</summary>
                <ul>
                  {parsed.skipped.slice(0, 20).map((s) => (
                    <li key={s.row}>Row {s.row}: {s.reason}</li>
                  ))}
                </ul>
              </details>
            )}

            <fieldset className={styles.modes}>
              {MODES.map((m) => (
                <label key={m.value}>
                  <input type="radio" name="imp-mode" checked={mode === m.value} onChange={() => setMode(m.value)} />
                  {m.label}
                </label>
              ))}
            </fieldset>
            {mode === "replace" && <div className={styles.warn}>This removes every current module and subtask.</div>}
          </>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={onClose}>Cancel</button>
          <button type="button" className={`${styles.btn} ${styles.primary}`} disabled={!items.length} onClick={confirm}>
            Import{items.length ? ` ${items.length}` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}