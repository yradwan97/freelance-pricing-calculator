import styles from './PricingGuideSection.module.css';

export default function PricingGuideSection() {
  return (
    <section className={styles.guide}>
      <div className={styles.guideContainer}>
        <h2 className={styles.heading}>Freelance Pricing Strategy Guide</h2>
        <p className={styles.intro}>
          Learn best practices for pricing freelance projects profitably without leaving money on the table.
        </p>

        <div className={styles.guideGrid}>
          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>The Multiplier Method</h3>
            <p className={styles.cardContent}>
              A salaried developer costs a company ~1.4x salary (taxes, benefits). Freelancers must cover all of this
              plus overhead, marketing, and downtime. A 2.5x-3x multiplier on salary-equivalent hourly rate is
              standard and necessary to stay profitable.
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Scope Creep Protection</h3>
            <p className={styles.cardContent}>
              Clients often underestimate changes and additions during development. A 20-30% buffer protects you from
              unpaid work. This isn't "extra profit"—it's a realistic estimate that accounts for human nature and
              unclear requirements.
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Complexity Tiers</h3>
            <p className={styles.cardContent}>
              <strong>Simple (1x):</strong> MVPs, landing pages, straightforward builds<br/>
              <strong>Standard (1.5x):</strong> Typical client apps, established patterns<br/>
              <strong>Complex (2x):</strong> Real-time features, evolving requirements, new tech<br/>
              <strong>Enterprise (2.5x):</strong> Large SaaS, legal/compliance, multi-team scaling
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Payment Schedules</h3>
            <p className={styles.cardContent}>
              Typical structure: 50% deposit (secures commitment), 30% at major milestone, 20% on delivery.
              This protects your cash flow and reduces refund disputes. Adjust based on client creditworthiness.
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Common Mistakes to Avoid</h3>
            <p className={styles.cardContent}>
              ❌ Underpricing to "win" a project<br/>
              ❌ Not accounting for revisions<br/>
              ❌ Forgetting admin/communication time<br/>
              ❌ Ignoring your tax burden<br/>
              ❌ Working without a payment schedule
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Industry Benchmarks</h3>
            <p className={styles.cardContent}>
              <strong>Junior Freelancers:</strong> $30-60/hr<br/>
              <strong>Mid-level:</strong> $75-150/hr<br/>
              <strong>Senior/Expert:</strong> $150-300+/hr<br/>
              Adjust for your location, experience, and specialization.
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Fixed vs. Hourly Pricing</h3>
            <p className={styles.cardContent}>
              <strong>Hourly:</strong> Best for ongoing work, retainers, or unclear scope. Protects you from underestimation.<br/>
              <strong>Fixed:</strong> Better for defined projects. Requires accurate estimation, but clients prefer predictable costs. Always add 20-30% buffer for unknowns.
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Handling Difficult Clients</h3>
            <p className={styles.cardContent}>
              Red flags: scope creep, payment delays, unrealistic timelines, vague requirements. Protect yourself with written contracts, upfront deposits, and clear revision limits. Sometimes the best clients are the ones you don't take. Not every dollar is worth your time.
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Building Long-term Relationships</h3>
            <p className={styles.cardContent}>
              Repeat clients are gold—they reduce sales overhead and know your work. Offer loyalty discounts (5-10% off for ongoing retainers) and prioritize their rush requests. One good long-term client is worth 10 one-off projects.
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Geographic Pricing Variations</h3>
            <p className={styles.cardContent}>
              US/Western Europe rates are 2-3x higher than Eastern Europe or Southeast Asia, reflecting cost of living and market rates. Remote work globalizes pricing—charge based on your expertise and market, not your location. Don't undercut your market.
            </p>
          </div>

          <div className={styles.guideCard}>
            <h3 className={styles.cardTitle}>Raising Your Rates</h3>
            <p className={styles.cardContent}>
              Increase rates annually by 10-20% minimum (inflation + experience). For existing clients, raise rates on new projects, not mid-contract. New clients won't know your old rates. After 2 years, you should be earning significantly more than when you started.
            </p>
          </div>
        </div>

        <div className={styles.tips}>
          <h3 className={styles.tipsTitle}>Quick Tips</h3>
          <ul className={styles.tipsList}>
            <li><strong>Always quote in writing.</strong> Verbal agreements cause disputes.</li>
            <li><strong>Define "done".</strong> Clear scope means fewer conflicts.</li>
            <li><strong>Set revision limits.</strong> e.g., "2 rounds of revisions included."</li>
            <li><strong>Build in margins.</strong> If you estimate 40 hours, charge for 50.</li>
            <li><strong>Review and adjust.</strong> Track actual vs. estimated hours to refine your estimates.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
