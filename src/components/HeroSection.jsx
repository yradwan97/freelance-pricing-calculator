import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>DevPricer</h1>
        <p className={styles.subtitle}>
          Professional Freelance Pricing Calculator
        </p>
        <p className={styles.description}>
          Stop underpricing your work. DevPricer helps freelance developers and agencies calculate
          fair, sustainable project rates based on salary targets, complexity, and scope. Get client-ready
          estimates in minutes.
        </p>
        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <span className={styles.icon}>✓</span>
            <span>Calculate rates from salary targets</span>
          </div>
          <div className={styles.benefit}>
            <span className={styles.icon}>✓</span>
            <span>Build modular project estimates</span>
          </div>
          <div className={styles.benefit}>
            <span className={styles.icon}>✓</span>
            <span>Account for complexity & scope creep</span>
          </div>
          <div className={styles.benefit}>
            <span className={styles.icon}>✓</span>
            <span>Generate professional PDF proposals</span>
          </div>
        </div>
      </div>
    </section>
  );
}
