// Excel / CSV -> module list parsing. `xlsx` is loaded lazily so it stays out of the main bundle.

const HRS_RE = /(hrs?|hours?|effort|estimate)/i;
const NAME_RE = /^(task|subtask|sub-task|component|name|title|item|description)/i;
const GROUP_RE = /^(module|group|feature|section|category)( name)?$/i;
const TOTAL_RE = /^(grand\s+)?total\b/i;

const norm = (v) => String(v ?? "").trim();

export function toHours(v) {
  if (typeof v === "number") return v;
  const m = String(v ?? "").replace(",", ".").match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
}

function mostlyNumeric(rows, idx, start) {
  const vals = rows.slice(start).map((r) => (r || [])[idx]).filter((v) => norm(v) !== "");
  if (!vals.length) return false;
  return vals.filter((v) => !Number.isNaN(toHours(v)) && /^[\d.,\s]+$/.test(norm(v))).length / vals.length > 0.7;
}

/**
 * Pure function: rows (array of arrays) -> { items, skipped, meta }
 *
 * Supported layouts (header row auto-detected within the first 10 rows):
 *   1. Name | Hours                  -> one module per row
 *   2. Module | Task | Hours         -> module with subtasks (blank Module cells inherit the one above)
 *   3. No header                     -> column A = name, column B = hours
 * If several hours-like columns exist (Impl / Test / Total) the "Total" one wins.
 */
export function extractModules(rows) {
  const skipped = [];
  let start = 0;
  let cols = { name: 0, group: -1, hrs: 1 };
  let headerFound = false;

  for (let r = 0; r < Math.min(rows.length, 10); r++) {
    const h = (rows[r] || []).map(norm);
    const hrsIdxs = h.map((c, i) => (HRS_RE.test(c) ? i : -1)).filter((i) => i >= 0);
    if (!hrsIdxs.length) continue;

    const hrs = hrsIdxs.find((i) => /total/i.test(h[i])) ?? hrsIdxs[0];
    const ok = (i) => i !== hrs && !mostlyNumeric(rows, i, r + 1); // ignores count columns like "Tasks: 12"
    let name = h.findIndex((c, i) => NAME_RE.test(c) && ok(i));
    let group = h.findIndex((c, i) => GROUP_RE.test(c) && ok(i));
    if (name === -1 && group !== -1) { name = group; group = -1; }
    if (name === -1) name = h.findIndex((c, i) => c !== "" && ok(i));
    if (name === -1) continue;

    cols = { name, group, hrs };
    start = r + 1;
    headerFound = true;
    break;
  }

  const items = [];
  const byGroup = new Map();
  let lastGroup = "";

  for (let r = start; r < rows.length; r++) {
    const row = rows[r] || [];
    if (row.every((c) => norm(c) === "")) continue;

    const rawName = norm(row[cols.name]);
    const rawGroup = cols.group >= 0 ? norm(row[cols.group]) : "";
    const hrs = toHours(row[cols.hrs]);

    if (!headerFound && r === 0 && Number.isNaN(hrs)) continue; // silent header row in headerless files
    if (TOTAL_RE.test(rawName) || TOTAL_RE.test(rawGroup)) continue;

    if (!(hrs > 0)) { skipped.push({ row: r + 1, reason: "Missing or invalid hours" }); continue; }
    const hrsRounded = Math.round(hrs * 100) / 100;

    if (cols.group < 0) {
      if (!rawName) { skipped.push({ row: r + 1, reason: "Missing name" }); continue; }
      items.push({ name: rawName, hrs: hrsRounded });
      continue;
    }

    const group = rawGroup || lastGroup;
    if (rawGroup) lastGroup = rawGroup;
    if (!group) { skipped.push({ row: r + 1, reason: "Missing module name" }); continue; }

    let mod = byGroup.get(group.toLowerCase());
    if (!mod) { mod = { name: group, hrs: 0, subtasks: [] }; byGroup.set(group.toLowerCase(), mod); items.push(mod); }

    if (rawName) mod.subtasks.push({ name: rawName, hrs: hrsRounded });
    else mod.hrs += hrsRounded; // module row with no task = plain module hours
  }

  items.forEach((m) => {
    if (m.subtasks) {
      if (m.subtasks.length) m.hrs = Math.round(m.subtasks.reduce((s, t) => s + t.hrs, 0) * 100) / 100;
      else delete m.subtasks;
    }
  });

  return { items, skipped, meta: { grouped: cols.group >= 0, headerFound } };
}

/** File (.xlsx / .xls / .csv) -> { sheetNames, sheets: { [name]: rows[][] } } */
export async function readWorkbook(file) {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const sheets = {};
  wb.SheetNames.forEach((n) => {
    sheets[n] = XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: "", raw: true });
  });
  return { sheetNames: wb.SheetNames, sheets };
}

export async function downloadTemplate() {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet([
    ["Module", "Task", "Hours"],
    ["Auth & user management", "Login + sessions", 8],
    ["Auth & user management", "Roles & permissions", 12],
    ["Payments", "", 16],
  ]);
  ws["!cols"] = [{ wch: 28 }, { wch: 30 }, { wch: 8 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Modules");
  XLSX.writeFile(wb, "modules-template.xlsx");
}