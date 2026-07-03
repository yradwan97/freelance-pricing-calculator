import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

const DEFAULT_MODULES = [
  { id: 'auth',      name: 'Auth & user management',  hrs: 20, active: true  },
  { id: 'dashboard', name: 'Dashboard & analytics',   hrs: 25, active: false },
  { id: 'crud',      name: 'CRUD / data tables',      hrs: 15, active: false },
  { id: 'api',       name: 'API integration',         hrs: 18, active: true  },
  { id: 'ui',        name: 'UI / design system',      hrs: 20, active: true  },
  { id: 'forms',     name: 'Forms & validation',      hrs: 10, active: false },
  { id: 'payments',  name: 'Payments module',         hrs: 20, active: false },
  { id: 'roles',     name: 'Roles & permissions',     hrs: 14, active: false },
  { id: 'notif',     name: 'Notifications',           hrs: 10, active: false },
  { id: 'deploy',    name: 'Deployment & CI setup',   hrs: 8,  active: false },
];

const DEFAULT_PAYMENTS = [
  {
    id: "deposit",
    phase: "Deposit",
    pct: 30,
    note: "Due before any work begins. Non-refundable.",
  },
  {
    id: "milestone",
    phase: "Milestone",
    pct: 40,
    note: "Due on core feature delivery / working demo.",
    featured: true,
  },
  {
    id: "final",
    phase: "Final",
    pct: 30,
    note: "Due on launch, handoff, or final acceptance.",
  },
];

const STORAGE_KEY = 'devpricer.pricingState.v1';
const DRAFTS_KEY = 'devpricer.drafts.v1';
const STORAGE_VERSION = 1;

function loadPersistedState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);

    // Validate and extract each field individually for robustness
    const result = {};

    if (typeof parsed.salary === 'number' && parsed.salary > 0) {
      result.salary = parsed.salary;
    }
    if (typeof parsed.mult === 'number' && parsed.mult > 0) {
      result.mult = parsed.mult;
    }
    if (typeof parsed.buffer === 'number' && parsed.buffer >= 0) {
      result.buffer = parsed.buffer;
    }
    if (typeof parsed.complexity === 'number') {
      result.complexity = parsed.complexity;
    }
    if (typeof parsed.clientName === 'string') {
      result.clientName = parsed.clientName;
    }
    if (typeof parsed.projectName === 'string') {
      result.projectName = parsed.projectName;
    }
    if (Array.isArray(parsed.modules)) {
      result.modules = parsed.modules.filter(m =>
        m && typeof m === 'object' && m.id && typeof m.name === 'string' && typeof m.hrs === 'number' && typeof m.active === 'boolean'
      );
    }
    if (Array.isArray(parsed.payments)) {
      result.payments = parsed.payments.filter(p =>
        p && typeof p === 'object' && p.id && typeof p.phase === 'string' && typeof p.pct === 'number'
      );
    }
    if (typeof parsed.currency === 'string') {
      result.currency = parsed.currency;
    }

    return result;
  } catch (e) {
    console.warn('Failed to load persisted state:', e);
    return {};
  }
}

function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, ...state }));
  } catch (e) {
    console.warn('Failed to persist state:', e);
  }
}

function getStateSnapshot(state) {
  return {
    salary: state.salary,
    mult: state.mult,
    buffer: state.buffer,
    complexity: state.complexity,
    modules: state.modules,
    clientName: state.clientName,
    projectName: state.projectName,
    payments: state.payments,
    currency: state.currency,
  };
}

function getSavedDrafts() {
  try {
    const stored = localStorage.getItem(DRAFTS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to load drafts:', e);
    return [];
  }
}

function saveDraftToStorage(name, state) {
  try {
    const drafts = getSavedDrafts();
    const newDraft = {
      id: Date.now(),
      name: name || `Draft ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      data: state,
    };
    drafts.push(newDraft);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    return newDraft;
  } catch (e) {
    console.warn('Failed to save draft:', e);
    return null;
  }
}

function deleteDraftFromStorage(draftId) {
  try {
    const drafts = getSavedDrafts();
    const filtered = drafts.filter(d => d.id !== draftId);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to delete draft:', e);
  }
}

export const COMPLEXITY_OPTIONS = [
  {
    value: 1.0,
    label: 'Simple',
    desc: 'Clear spec, standard UI patterns, minimal custom logic. Typical for MVPs, internal tools, or well-defined landing pages with basic CMS.',
  },
  {
    value: 1.3,
    label: 'Standard',
    desc: 'Some ambiguity in requirements, moderate custom logic, 2–3 third-party integrations. Most client web apps fall here.',
  },
  {
    value: 1.7,
    label: 'Complex',
    desc: 'Non-standard features, significant custom logic, real-time data, multiple API integrations, or a greenfield product with evolving requirements.',
  },
  {
    value: 2.2,
    label: 'Enterprise',
    desc: 'Large stakeholder groups, strict compliance or security requirements, legacy system integration, or multi-tenant SaaS architecture. Expect long review cycles.',
  },
];

export const PAYMENT_TIPS = {
  1.0: 'Simple project: a clean 50/50 split (deposit + final) also works. Keep the final payment small so you close quickly without chasing invoices.',
  1.3: 'Standard build: tie the milestone payment to a working demo with core features — not just time elapsed. Avoids paying for invisible progress.',
  1.7: 'Complex project: consider adding a mid-sprint check-in invoice. Never complete more than 50% of work before receiving at least 30% of the total.',
  2.2: 'Enterprise: split into 4 payments — 25% deposit, 25% on spec sign-off, 25% UAT, 25% on launch. Always include a monthly retainer option for post-launch support.',
};

let _idCounter = 1;

export function usePricing() {
  const persistedRef = useRef(null);
  if (persistedRef.current === null) {
    persistedRef.current = loadPersistedState();
  }
  const persisted = persistedRef.current;

  const [salary,     setSalary]     = useState(persisted.salary ?? 30000);
  const [mult,       setMult]       = useState(persisted.mult ?? 2.5);
  const [buffer,     setBuffer]     = useState(persisted.buffer ?? 25);
  const [complexity, setComplexity] = useState(persisted.complexity ?? 1.0);
  const [modules,    setModules]    = useState(persisted.modules ?? DEFAULT_MODULES);
  const [clientName, setClientName] = useState(persisted.clientName ?? '');
  const [projectName, setProjectName] = useState(persisted.projectName ?? 'Web Application Development');
  const [payments, setPayments] = useState(persisted.payments ?? DEFAULT_PAYMENTS);
  const [currency, setCurrency] = useState(persisted.currency ?? 'EGP');

  // Derived rate values
  const ftHr    = salary / 160;
  const flHr    = ftHr * mult;
  const dayRate = flHr * 8;

  // Module operations
  const toggleModule = useCallback((id) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  }, []);

  const updateModuleHrs = useCallback((id, hrs) => {
    const val = Math.max(1, parseInt(hrs, 10) || 1);
    setModules(prev => prev.map(m => m.id === id ? { ...m, hrs: val } : m));
  }, []);

  const addModule = useCallback((name, hrs) => {
    setModules(prev => [...prev, {
      id:     `custom_${_idCounter++}`,
      name,
      hrs:    Math.max(1, parseInt(hrs, 10) || 1),
      active: true,
      custom: true,
    }]);
  }, []);

  const removeModule = useCallback((id) => {
    setModules(prev => prev.filter(m => m.id !== id));
  }, []);

  const selectAll  = useCallback(() => setModules(prev => prev.map(m => ({ ...m, active: true  }))), []);
  const clearAll   = useCallback(() => setModules(prev => prev.map(m => ({ ...m, active: false }))), []);

  // Estimate calculations
  const estimate = useMemo(() => {
    const active   = modules.filter(m => m.active);
    const totalHrs = active.reduce((s, m) => s + m.hrs, 0);
    const rawCost  = totalHrs * flHr;
    const afterCx  = rawCost * complexity;
    const bufAmt   = afterCx * (buffer / 100);
    const total    = afterCx + bufAmt;
    return { active, totalHrs, rawCost, afterCx, bufAmt, total };
  }, [modules, flHr, complexity, buffer]);

  const complexityOption = COMPLEXITY_OPTIONS.find(o => o.value === complexity);

  const updatePayment = useCallback((id, field, value) => {
  setPayments(prev =>
    prev.map(p =>
      p.id === id
        ? {
            ...p,
            [field]:
              field === "pct"
                ? Math.max(0, Number(value) || 0)
                : value,
          }
        : p
    )
  );
}, []);

const addPayment = useCallback(() => {
  setPayments(prev => [
    ...prev,
    {
      id: `payment_${Date.now()}`,
      phase: `Payment ${prev.length + 1}`,
      pct: 0,
      note: "",
    },
  ]);
}, []);

const removePayment = useCallback((id) => {
  setPayments(prev => prev.filter(p => p.id !== id));
}, []);

const equalizePayments = useCallback(() => {
  setPayments(prev => {
    if (!prev.length) return prev;

    const equal = Math.floor((100 / prev.length) * 100) / 100;

    const result = prev.map(p => ({
      ...p,
      pct: equal,
    }));

    const total = result.reduce((s, p) => s + p.pct, 0);

    result[result.length - 1].pct += +(100 - total).toFixed(2);

    return result;
  });
}, []);

const equalizeOtherPayments = useCallback((currentId) => {
    setPayments(prev => {
      if (prev.length <= 1) return prev;

      const currentPayment = prev.find(p => p.id === currentId);
      if (!currentPayment) return prev;

      const remainingPct = 100 - Number(currentPayment.pct);
      const otherCount = prev.length - 1;
      const equalShare = Number((remainingPct / otherCount).toFixed(2));

      let updated = prev.map(payment => {
        if (payment.id === currentId) {
          return payment; // keep this one unchanged
        }
        return { ...payment, pct: equalShare };
      });

      // Ensure total is exactly 100%
      const currentTotal = updated.reduce((sum, p) => sum + p.pct, 0);
      const diff = Number((100 - currentTotal).toFixed(2));

      if (diff !== 0) {
        const lastOtherIndex = updated.findIndex(p => p.id !== currentId);
        if (lastOtherIndex !== -1) {
          updated[lastOtherIndex] = {
            ...updated[lastOtherIndex],
            pct: Number((updated[lastOtherIndex].pct + diff).toFixed(2))
          };
        }
      }

      return updated;
    });
  }, []);

const paymentTotalPct = useMemo(
  () => payments.reduce((sum, p) => sum + Number(p.pct || 0), 0),
  [payments]
);

const isPaymentValid = Math.abs(paymentTotalPct - 100) < 0.01;

  // Immediate persistence effect - save on every change
  useEffect(() => {
    persistState({
      salary,
      mult,
      buffer,
      complexity,
      modules,
      clientName,
      projectName,
      payments,
      currency,
    });
  }, [salary, mult, buffer, complexity, modules, clientName, projectName, payments, currency]);

  const saveDraft = useCallback((draftName) => {
    const snapshot = getStateSnapshot({
      salary,
      mult,
      buffer,
      complexity,
      modules,
      clientName,
      projectName,
      payments,
      currency,
    });

    if (draftName) {
      // Save to localStorage drafts list with a name
      saveDraftToStorage(draftName, snapshot);
    } else {
      // Download as JSON file
      const json = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quote-${clientName || 'unnamed'}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [salary, mult, buffer, complexity, modules, clientName, projectName, payments, currency]);

  const loadDraft = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);

        // Validate and restore each field, falling back to current if invalid
        if (typeof parsed.salary === 'number' && parsed.salary > 0) setSalary(parsed.salary);
        if (typeof parsed.mult === 'number' && parsed.mult > 0) setMult(parsed.mult);
        if (typeof parsed.buffer === 'number' && parsed.buffer >= 0) setBuffer(parsed.buffer);
        if (typeof parsed.complexity === 'number') setComplexity(parsed.complexity);
        if (typeof parsed.clientName === 'string') setClientName(parsed.clientName);
        if (typeof parsed.projectName === 'string') setProjectName(parsed.projectName);
        if (Array.isArray(parsed.modules) && parsed.modules.length > 0 && parsed.modules[0].id) {
          setModules(parsed.modules);
        }
        if (Array.isArray(parsed.payments) && parsed.payments.length > 0 && parsed.payments[0].id) {
          setPayments(parsed.payments);
        }
        if (typeof parsed.currency === 'string') setCurrency(parsed.currency);
      } catch (err) {
        console.error('Failed to load draft:', err);
        alert('Failed to load draft. File may be corrupted.');
      }
    };
    reader.readAsText(file);
  }, []);

  const loadDraftFromStorage = useCallback((draft) => {
    const data = draft.data;
    if (typeof data.salary === 'number' && data.salary > 0) setSalary(data.salary);
    if (typeof data.mult === 'number' && data.mult > 0) setMult(data.mult);
    if (typeof data.buffer === 'number' && data.buffer >= 0) setBuffer(data.buffer);
    if (typeof data.complexity === 'number') setComplexity(data.complexity);
    if (typeof data.clientName === 'string') setClientName(data.clientName);
    if (typeof data.projectName === 'string') setProjectName(data.projectName);
    if (Array.isArray(data.modules) && data.modules.length > 0 && data.modules[0].id) {
      setModules(data.modules);
    }
    if (Array.isArray(data.payments) && data.payments.length > 0 && data.payments[0].id) {
      setPayments(data.payments);
    }
    if (typeof data.currency === 'string') setCurrency(data.currency);
  }, []);

  const getSavedDraftsCallback = useCallback(() => {
    return getSavedDrafts();
  }, []);

  const deleteDraft = useCallback((draftId) => {
    deleteDraftFromStorage(draftId);
  }, []);

  const resetAllToDefaults = useCallback(() => {
    setSalary(30000);
    setMult(2.5);
    setBuffer(25);
    setComplexity(1.0);
    setModules(DEFAULT_MODULES);
    setClientName('');
    setProjectName('Web Application Development');
    setPayments(DEFAULT_PAYMENTS);
    setCurrency('EGP');
  }, []);

  return {
    // Rate inputs
    salary, setSalary,
    mult,   setMult,
    buffer, setBuffer,
    // Derived rates
    ftHr, flHr, dayRate,
    // Complexity
    complexity, setComplexity, complexityOption,
    // Modules
    modules, toggleModule, updateModuleHrs, addModule, removeModule, selectAll, clearAll,
    // Estimate
    estimate,
    clientName, setClientName,
    projectName, setProjectName,
    payments,
    updatePayment,
    addPayment,
    removePayment,
    equalizePayments,
    equalizeOtherPayments,
    paymentTotalPct,
    isPaymentValid,
    // Currency
    currency, setCurrency,
    // Draft save/load
    saveDraft, loadDraft, loadDraftFromStorage, getSavedDraftsCallback, deleteDraft,
    // Reset
    resetAllToDefaults,
  };
}
