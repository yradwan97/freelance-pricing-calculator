import { useState } from 'react';
import styles from './FAQSection.module.css';

const faqs = [
  {
    q: "How do I calculate my freelance hourly rate?",
    a: "Enter your desired monthly salary and the calculator will derive your hourly rate. For example, if you want to earn $5,000/month, the calculator divides by 160 working hours and applies a freelancer multiplier (typically 2.5x a salary-equivalent rate) to account for non-billable time, taxes, and overhead."
  },
  {
    q: "What does the 'Freelancer Multiplier' mean?",
    a: "The multiplier accounts for the difference between salaried and freelance work. A 2.5x multiplier is standard: it covers 20% buffer for revisions, 20% for non-billable admin/marketing, ~30% in taxes, and 20% profit margin. You can adjust based on your needs and experience level."
  },
  {
    q: "Why do I need a 'Scope Buffer'?",
    a: "Scope creep is inevitable. A 20-30% buffer protects you from losing money on revisions, client delays, unclear requirements, and extra communication. It's better to quote with buffer and deliver on time than to under-quote and overwork."
  },
  {
    q: "How do I estimate project hours?",
    a: "Use the modular sections (authentication, dashboard, API, etc.) to break down the project. Start with estimates from past projects or industry benchmarks. For new work, add 20-30% extra hours as contingency. The more modular, the more accurate."
  },
  {
    q: "What's the difference between Simple, Standard, Complex, and Enterprise?",
    a: "Simple projects are MVPs or landing pages (minimal unknowns). Standard are typical client apps with standard integrations. Complex have evolving requirements, real-time features, or tricky tech. Enterprise are large SaaS products or compliance-heavy work. Each tier multiplies the base rate to reflect risk and effort."
  },
  {
    q: "Can I export my estimate as a PDF?",
    a: "Yes. Click 'Export to PDF' and it generates a professional, client-ready proposal with your modules, pricing, complexity notes, and payment schedule. You can customize the client and project names before exporting."
  },
  {
    q: "Can I save multiple estimates?",
    a: "Yes. Use 'Save Draft' to store a quote snapshot. You can load, edit, and delete drafts anytime. Drafts are saved locally on your device, so they persist across browser sessions."
  },
  {
    q: "Does this include taxes or invoicing?",
    a: "The calculator gives you a project fee—it does not include tax calculations or invoice generation. Add your local tax rate on top of the final price when invoicing the client."
  }
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className={styles.faq}>
      <div className={styles.faqContainer}>
        <h2 className={styles.heading}>Frequently Asked Questions</h2>
        <p className={styles.intro}>
          Learn how to use DevPricer to set sustainable freelance rates and estimate projects accurately.
        </p>

        <div className={styles.faqList}>
          {faqs.map((item, idx) => (
            <div key={idx} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                aria-expanded={activeIndex === idx}
              >
                <span className={styles.questionText}>{item.q}</span>
                <span className={styles.toggleIcon}>
                  {activeIndex === idx ? '−' : '+'}
                </span>
              </button>
              {activeIndex === idx && (
                <div className={styles.faqAnswer}>
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
