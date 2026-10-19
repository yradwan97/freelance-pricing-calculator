import styles from './QuickTipsBox.module.css';

export default function QuickTipsBox() {
  return (
    <section className={styles.quickTips}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Quick Pricing Tips</h2>
        <div className={styles.tipsGrid}>
          <div className={styles.tip}>
            <span className={styles.icon}>💰</span>
            <h3>Know Your Worth</h3>
            <p>A 2.5-3x salary multiplier covers taxes, overhead, and downtime. Don't undersell yourself.</p>
          </div>
          <div className={styles.tip}>
            <span className={styles.icon}>📋</span>
            <h3>Always Quote in Writing</h3>
            <p>Clear scope and written agreement prevent disputes. Define deliverables and revision limits upfront.</p>
          </div>
          <div className={styles.tip}>
            <span className={styles.icon}>🛡️</span>
            <h3>Buffer for Creep</h3>
            <p>Add 20-30% to account for scope creep, revisions, and unclear requirements. It's not extra profit—it's realistic.</p>
          </div>
          <div className={styles.tip}>
            <span className={styles.icon}>💳</span>
            <h3>Structured Payments</h3>
            <p>Use 50-30-20 deposit-milestone-delivery to protect cash flow and reduce refund disputes.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
