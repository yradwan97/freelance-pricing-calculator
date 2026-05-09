import React, { useCallback } from 'react';
import { usePricing } from './hooks/usePricing';
import Header from './components/Header';
import RateSection from './components/RateSection';
import ModulesSection from './components/ModulesSection';
import ComplexitySection from './components/ComplexitySection';
import EstimateSection from './components/EstimateSection';
import PaymentSection from './components/PaymentSection';
import PrintView from './components/PrintView';
import styles from './App.module.css';

export default function App() {
  const pricing = usePricing();

  const handleExport = useCallback(() => {
    // Show print-view, trigger print, then hide it again
    const el = document.getElementById('print-view');
    if (el) {
      el.style.display = 'block';
      window.print();
      el.style.display = 'none';
    }
  }, []);

  return (
    <>
      <Header onExport={handleExport} />

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
        />
      </main>

      {/* Off-screen print-only view */}
      <PrintView
        estimate={pricing.estimate}
        complexity={pricing.complexity}
        buffer={pricing.buffer}
        flHr={pricing.flHr}
      />
    </>
  );
}
