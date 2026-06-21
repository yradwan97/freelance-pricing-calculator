import { useState, useCallback, useMemo } from 'react';

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
  const [salary,     setSalary]     = useState(30000);
  const [mult,       setMult]       = useState(2.5);
  const [buffer,     setBuffer]     = useState(25);
  const [complexity, setComplexity] = useState(1.0);
  const [modules,    setModules]    = useState(DEFAULT_MODULES);
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('Web Application Development');
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);

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

const paymentTotalPct = useMemo(
  () => payments.reduce((sum, p) => sum + Number(p.pct || 0), 0),
  [payments]
);

const isPaymentValid = Math.abs(paymentTotalPct - 100) < 0.01;

const applyParsedModules = useCallback((parsedModules) => {
  setModules(prev => {
    const existingIds = new Set(prev.map(m => m.id));
    const newModules = parsedModules.filter(m => !existingIds.has(m.id));

    return [
      ...prev.map(existing => {
        const match = parsedModules.find(p => 
          p.name.toLowerCase().includes(existing.name.toLowerCase().slice(0, 8)) ||
          existing.name.toLowerCase().includes(p.name.toLowerCase().slice(0, 8))
        );
        return match ? { ...existing, hrs: match.hrs, active: true } : existing;
      }),
      ...newModules
    ];
  });
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
    paymentTotalPct,
    isPaymentValid,
    applyParsedModules
  };
}
