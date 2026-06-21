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
        payments: pricing.payments
      });
    } finally {
      setExporting(false);
    }
  }, [pricing.estimate, pricing.complexity, pricing.buffer, pricing.clientName, pricing.projectName, pricing.payments]);

  return (
    <>
      <Header onExport={handleExport} exporting={exporting} clientName={pricing.clientName} setClientName={pricing.setClientName} projectName={pricing.projectName} setProjectName={pricing.setProjectName} />

      <main className={styles.main}>
        <RateSection
          salary={pricing.salary}   setSalary={pricing.setSalary}
          mult={pricing.mult}       setMult={pricing.setMult}
          buffer={pricing.buffer}   setBuffer={pricing.setBuffer}
          ftHr={pricing.ftHr}
          flHr={pricing.flHr}
          dayRate={pricing.dayRate}
        />

        <ModulesSection
          modules={pricing.modules}
          flHr={pricing.flHr}
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
        />

        <PaymentSection
          total={pricing.estimate.total}
          complexity={pricing.complexity}
          payments={pricing.payments}
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
