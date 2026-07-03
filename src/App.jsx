import React, { useCallback, useState } from 'react';
import { usePricing } from './hooks/usePricing';
import Header from './components/Header';
import RateSection from './components/RateSection';
import ModulesSection from './components/ModulesSection';
import ComplexitySection from './components/ComplexitySection';
import EstimateSection from './components/EstimateSection';
import PaymentSection from './components/PaymentSection';
import { exportEstimatePdf } from './pdfExport';
import styles from './App.module.css';

export default function App() {
  const pricing = usePricing();
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      // Yield a frame so the button can show its busy state before the
      // (synchronous, occasionally chunky) PDF draw call runs.
      await new Promise(requestAnimationFrame);
      exportEstimatePdf({
        estimate: pricing.estimate,
        complexity: pricing.complexity,
        buffer: pricing.buffer,
        clientName: pricing.clientName,
        projectName: pricing.projectName,
        payments: pricing.payments,
        currency: pricing.currency
      });
    } finally {
      setExporting(false);
    }
  }, [pricing.estimate, pricing.complexity, pricing.buffer, pricing.clientName, pricing.projectName, pricing.payments, pricing.currency]);

  return (
    <>
      <Header
        onExport={handleExport} exporting={exporting}
        saveDraft={pricing.saveDraft}
        loadDraft={pricing.loadDraft}
        loadDraftFromStorage={pricing.loadDraftFromStorage}
        getSavedDrafts={pricing.getSavedDraftsCallback}
        deleteDraft={pricing.deleteDraft}
        clientName={pricing.clientName}
        projectName={pricing.projectName}
      />

      <main className={styles.main}>
        <section className={styles.clientSection}>
          <div className={styles.clientGrid}>
            <div className={styles.clientField}>
              <label className={styles.clientLabel}>Client Name</label>
              <input
                type="text"
                placeholder="Client Name"
                value={pricing.clientName}
                onChange={(e) => pricing.setClientName(e.target.value)}
                className={styles.clientInput}
              />
            </div>
            <div className={styles.clientField}>
              <label className={styles.clientLabel}>Project Name</label>
              <input
                type="text"
                placeholder="Project Name"
                value={pricing.projectName}
                onChange={(e) => pricing.setProjectName(e.target.value)}
                className={styles.clientInput}
              />
            </div>
          </div>
        </section>
        <RateSection
          salary={pricing.salary}   setSalary={pricing.setSalary}
          mult={pricing.mult}       setMult={pricing.setMult}
          buffer={pricing.buffer}   setBuffer={pricing.setBuffer}
          currency={pricing.currency} setCurrency={pricing.setCurrency}
          ftHr={pricing.ftHr}
          flHr={pricing.flHr}
          dayRate={pricing.dayRate}
          resetAllToDefaults={pricing.resetAllToDefaults}
        />

        <ModulesSection
          modules={pricing.modules}
          flHr={pricing.flHr}
          currency={pricing.currency}
          toggleModule={pricing.toggleModule}
          updateModuleHrs={pricing.updateModuleHrs}
          addModule={pricing.addModule}
          removeModule={pricing.removeModule}
          selectAll={pricing.selectAll}
          clearAll={pricing.clearAll}
        />

        <ComplexitySection
          complexity={pricing.complexity}
          setComplexity={pricing.setComplexity}
        />

        <EstimateSection
          estimate={pricing.estimate}
          complexity={pricing.complexity}
          complexityOption={pricing.complexityOption}
          buffer={pricing.buffer}
          currency={pricing.currency}
        />

        <PaymentSection
          total={pricing.estimate.total}
          complexity={pricing.complexity}
          payments={pricing.payments}
          currency={pricing.currency}
          updatePayment={pricing.updatePayment}
          addPayment={pricing.addPayment}
          removePayment={pricing.removePayment}
          equalizePayments={pricing.equalizePayments}
          equalizeOtherPayments={pricing.equalizeOtherPayments}
          paymentTotalPct={pricing.paymentTotalPct}
          isPaymentValid={pricing.isPaymentValid}
        />
      </main>
    </>
  );
}
