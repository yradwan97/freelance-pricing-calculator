import styles from './HowToUseGuide.module.css';

export default function HowToUseGuide() {
  return (
    <section className={styles.guide}>
      <div className={styles.container}>
        <h2 className={styles.heading}>How to Use DevPricer</h2>
        <p className={styles.intro}>
          Generate accurate project estimates in 5 simple steps.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Set Your Target Salary</h3>
              <p>
                Enter your desired monthly income. DevPricer will calculate your hourly rate using a freelancer
                multiplier (default 2.5x) to account for taxes, overhead, and non-billable time.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Select Project Modules</h3>
              <p>
                Choose from predefined components (auth, dashboard, API, etc.) and estimate hours for each. Use
                past projects or industry benchmarks to make accurate estimates. You can add custom modules too.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Account for Complexity</h3>
              <p>
                Select your project complexity level (Simple, Standard, Complex, Enterprise) based on unknowns,
                requirements evolution, and technical risk. This multiplier reflects real effort differences.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3>Add a Scope Buffer</h3>
              <p>
                Include a 20-30% buffer to protect against scope creep, revisions, and unclear requirements.
                This isn't padding—it's a realistic estimate that clients actually need.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h3>Generate & Export</h3>
              <p>
                Review your estimate, set up a payment schedule, and export as a professional PDF proposal.
                Use it for client negotiations or internal documentation.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.keyPoints}>
          <h3 className={styles.keyPointsTitle}>Key Takeaways</h3>
          <ul className={styles.pointsList}>
            <li>✓ <strong>Don't underprice</strong> — Your rate must cover all freelance costs</li>
            <li>✓ <strong>Be modular</strong> — Break projects into components for accuracy</li>
            <li>✓ <strong>Account for risk</strong> — Complexity and buffer protect your profitability</li>
            <li>✓ <strong>Quote in writing</strong> — Always use a documented scope and proposal</li>
            <li>✓ <strong>Use payment schedules</strong> — Protect your cash flow and reduce disputes</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
