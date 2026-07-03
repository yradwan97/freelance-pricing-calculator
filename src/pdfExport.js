// src/pdfExport.js
// Builds a real, downloadable PDF (not a screenshot / window.print()).
// Uses jsPDF's native drawing API + autoTable so pagination is exact:
// rows never split mid-row, headings never get orphaned above an
// empty bottom margin, and tables are excluded if there's nothing to show.

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './utils';
import { COMPLEXITY_OPTIONS, PAYMENT_TIPS } from './hooks/usePricing';

const PAGE_W   = 210; // A4 mm
const PAGE_H   = 297;
const MARGIN   = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_RESERVE = 16; // space kept clear at bottom of every page for the footer

const INK       = [24, 24, 28];
const INK_SOFT  = [90, 90, 98];
const INK_FAINT = [150, 150, 158];
const LINE      = [222, 222, 226];
const ACCENT    = [120, 168, 46];   // darker, print-safe version of the app's lime accent

/**
 * Moves the cursor to a new page if `needed` mm of vertical space isn't
 * left above the footer reserve. Returns the (possibly reset) y cursor.
 * This is what guarantees section headings and summary blocks always
 * start at the top of a page rather than splitting mid-block.
 */
function ensureSpace(doc, y, needed) {
  if (y + needed > PAGE_H - FOOTER_RESERVE) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function drawHeader(doc, clientName, projectName) {
  const generated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  let y = MARGIN;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(...INK);
  doc.text('DevPricer', MARGIN, y + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...INK_SOFT);
  doc.text('Freelance project estimate', MARGIN, y + 8);

  doc.setFontSize(9);
  doc.setTextColor(...INK_FAINT);
  doc.text(`Generated ${generated}`, PAGE_W - MARGIN, y + 2, { align: 'right' });

  y += 16;
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...INK_FAINT);
  doc.text('CLIENT / PROJECT', MARGIN, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  const clientLabel = clientName?.trim() ? clientName.trim() : 'Unnamed client';
  const projectLabel = projectName?.trim() ? projectName.trim() : 'Untitled project';
  const fullLine = `${clientLabel}  —  ${projectLabel}`;

  // Shrink to fit on one line first; if it's still too wide even at the
  // smallest acceptable size, wrap onto a second line instead of running
  // off the page edge.
  let cpFontSize = 11;
  doc.setFontSize(cpFontSize);
  while (doc.getTextWidth(fullLine) > CONTENT_W && cpFontSize > 8.5) {
    cpFontSize -= 0.5;
    doc.setFontSize(cpFontSize);
  }
  doc.setTextColor(...INK);

  if (doc.getTextWidth(fullLine) <= CONTENT_W) {
    doc.text(fullLine, MARGIN, y);
    y += 10;
  } else {
    const wrapped = doc.splitTextToSize(fullLine, CONTENT_W);
    doc.text(wrapped, MARGIN, y);
    y += wrapped.length * 5.5 + 4.5;
  }

  return y;
}

function drawSectionLabel(doc, y, num, title) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...INK_FAINT);
  doc.text(`${num}`, MARGIN, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(...INK);
  doc.text(title, MARGIN, y + 6.5);

  return y + 13;
}

const tableTheme = {
  styles: {
    font: 'helvetica',
    fontSize: 9,
    cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
    textColor: INK,
    lineColor: LINE,
    lineWidth: 0.2,
    valign: 'middle',
  },
  headStyles: {
    fillColor: INK,
    textColor: [255, 255, 255],
    fontStyle: 'bold',
    fontSize: 8.5,
  },
  alternateRowStyles: { fillColor: [249, 249, 250] },
};

function drawModulesTable(doc, y, active, totalHrs, rawCost, currency) {
  const rows = active.map(m => [
    m.name,
    String(m.hrs),
    formatCurrency(m.hrs * (rawCost / totalHrs), currency),
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE + 6 },
    head: [['Module', 'Hours', 'Cost']],
    body: rows,
    foot: [['Total', String(totalHrs), formatCurrency(rawCost, currency)]],
    showFoot: 'lastPage',
    ...tableTheme,
    footStyles: {
      fillColor: [238, 238, 240],
      textColor: INK,
      fontStyle: 'bold',
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 22, halign: 'right' },
      2: { cellWidth: 32, halign: 'right' },
    },
    rowPageBreak: 'avoid', // never split a single row across two pages
  });

  return doc.lastAutoTable.finalY;
}

function drawCostSummary(doc, y, { totalHrs, complexityOption, complexity, buffer, bufAmt, total, currency }) {
  const boxX = MARGIN;
  const boxW = CONTENT_W;
  const lineH = 7;
  const rows = [
    ['Total hours', `${totalHrs} hrs`],
    ['Complexity', `${complexityOption?.label ?? '—'}  ×${complexity.toFixed(1)}`],
    ['Scope buffer', `+${buffer}%   ->   ${formatCurrency(bufAmt, currency)}`],
  ];

  const padTop = 6, padBottom = 8;
  const totalRowH = 13;
  const boxH = padTop + rows.length * lineH + totalRowH + padBottom;

  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.setFillColor(...[252, 252, 253]);
  doc.roundedRect(boxX, y, boxW, boxH, 2, 2, 'FD');

  let ry = y + padTop + 3;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  rows.forEach(([label, value]) => {
    doc.setTextColor(...INK_SOFT);
    doc.text(label, boxX + 6, ry);
    doc.setTextColor(...INK);
    doc.setFont('helvetica', 'bold');
    doc.text(value, boxX + boxW - 6, ry, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    ry += lineH;
  });

  ry += 2;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(boxX + 6, ry, boxX + boxW - 6, ry);

  ry += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(...INK);
  doc.text('Total project price', boxX + 6, ry);
  doc.setFontSize(14);
  doc.text(formatCurrency(total, currency), boxX + boxW - 6, ry, { align: 'right' });

  return y + boxH;
}

function drawPaymentTable(doc, y, total, payments, currency) {
  const rows = payments.map((p) => [
    p.phase,
    `${Number(p.pct).toFixed(2)}%`,
    formatCurrency(total * (p.pct / 100), currency),
    p.note || '',
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE + 6 },
    head: [['Phase', '%', 'Amount', 'Notes']],
    body: rows,
    ...tableTheme,
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
      3: { cellWidth: 'auto', textColor: INK_SOFT },
    },
    rowPageBreak: 'avoid',
  });

  return doc.lastAutoTable.finalY;
}

function drawTip(doc, y, tip) {
  const innerW = CONTENT_W - 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const lines = doc.splitTextToSize(tip, innerW);
  const boxH = lines.length * 4.3 + 8;

  doc.setFillColor(...[249, 249, 250]);
  doc.rect(MARGIN, y, CONTENT_W, boxH, 'F');
  doc.setFillColor(...ACCENT);
  doc.rect(MARGIN, y, 1.2, boxH, 'F');

  doc.setTextColor(...INK_SOFT);
  doc.text(lines, MARGIN + 6, y + 5.5);

  return y + boxH;
}

function addFooters(doc, projectName) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageNumLabel = `Page 1 of ${pageCount}`; // widest realistic case, used to budget space

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const fy = PAGE_H - 10;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, fy - 4, PAGE_W - MARGIN, fy - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...INK_FAINT);

    let label = `DevPricer estimate — ${projectName?.trim() || 'Untitled project'}`;
    const reserveForPageNum = doc.getTextWidth(pageNumLabel) + 10;
    while (doc.getTextWidth(label) > CONTENT_W - reserveForPageNum && label.length > 20) {
      label = label.slice(0, -2);
    }
    if (label !== `DevPricer estimate — ${projectName?.trim() || 'Untitled project'}`) {
      label = label.replace(/\s+$/, '') + '…';
    }

    doc.text(label, MARGIN, fy);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_W - MARGIN, fy, { align: 'right' });
  }
}

/**
 * Builds the estimate PDF document and returns the jsPDF instance
 * (without saving it). Intentionally omits the base-rate / multiplier
 * inputs section — only module hours, the cost summary, and the
 * payment schedule are included.
 */
export function buildEstimateDoc({ estimate, complexity, buffer, clientName, projectName, payments, currency }) {
  const { active, totalHrs, rawCost, bufAmt, total } = estimate;
  const complexityOption = COMPLEXITY_OPTIONS.find(o => o.value === complexity);
  const tip = PAYMENT_TIPS[complexity] || '';

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  let y = drawHeader(doc, clientName, projectName);

  // ── 01 — Project modules & hours ──────────────────────────────
  y = ensureSpace(doc, y, 34); // heading + head row + >=1 body row
  y = drawSectionLabel(doc, y, '01', 'Project modules & hours');

  if (active.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...INK_SOFT);
    doc.text('No modules selected.', MARGIN, y + 4);
    y += 12;
  } else {
    y = drawModulesTable(doc, y, active, totalHrs, rawCost, currency) + 8;
  }

  // ── Cost summary ───────────────────────────────────────────────
  const summaryHeight = 6 + 3 * 7 + 13 + 8;
  y = ensureSpace(doc, y, summaryHeight);
  y = drawCostSummary(doc, y, { totalHrs, complexityOption, complexity, buffer, bufAmt, total, currency }) + 12;

  // ── 02 — Payment schedule ─────────────────────────────────────
  y = ensureSpace(doc, y, 34);
  y = drawSectionLabel(doc, y, '02', 'Payment schedule');
  y = drawPaymentTable(doc, y, total, payments, currency) + 8;

  if (tip) {
    const tipLineCount = doc.splitTextToSize(tip, CONTENT_W - 10).length;
    y = ensureSpace(doc, y, tipLineCount * 4.3 + 8);
    y = drawTip(doc, y, tip) + 4; // eslint-disable-line no-unused-vars
  }

  addFooters(doc, projectName);

  return doc;
}

/**
 * Generates and downloads the estimate PDF.
 */
export function exportEstimatePdf(props) {
  const doc = buildEstimateDoc(props);
  const { projectName } = props;
  const safeProject = (projectName?.trim() || 'project').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`DevPricer-Estimate-${safeProject}-${dateStr}.pdf`);
}
