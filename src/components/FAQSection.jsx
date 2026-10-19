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
  },
  {
    q: "How do I handle retainer clients?",
    a: "For retainers, divide your hourly rate by hours per month (e.g., $150/hr ÷ 160 hours = ~$24k/month for full-time). For part-time retainers, offer tiered packages: e.g., 20 hrs/month, 40 hrs/month, or unlimited. Lock in availability upfront to avoid scope creep."
  },
  {
    q: "How do I price maintenance and support work?",
    a: "Support is worth less than development (it's reactive, not creative). Price support at 60-70% of your development rate, or offer as a monthly retainer. Example: if dev rate is $150/hr, support is $90-105/hr. Set response time SLAs upfront."
  },
  {
    q: "What if a client asks to lower my rate?",
    a: "Negotiation is normal, but don't underbid to win work—it kills profitability. Counter by offering: fewer features, longer timeline, or smaller scope. Explain that your rate reflects experience and quality. Cheap work isn't quality; quality work isn't cheap."
  },
  {
    q: "How do I handle scope changes after the project starts?",
    a: "Define 'scope' in writing before starting. For changes mid-project: quote the change separately, get approval, pause the project until paid, or adjust the final payment. Never absorb scope creep for free—it destroys your margins."
  },
  {
    q: "What's a healthy profit margin for freelancers?",
    a: "Aim for 30-50% profit after all expenses (time, tools, taxes, overhead). If your multiplier leaves you less than 30% profit after taxes and expenses, raise your rate. Calculate backwards: desired profit + taxes + overhead = minimum hourly rate."
  },
  {
    q: "How do I track actual hours vs. estimated hours?",
    a: "Use tools like Toggl, Harvest, or even a spreadsheet. Log time daily while you work. After 5-10 projects, you'll see your estimation accuracy improve. Track by module/feature to refine future estimates."
  },
  {
    q: "Should I charge extra for revisions?",
    a: "Yes. Include 2-3 revision rounds in your estimate, then charge for extras. Be clear: 'Project includes up to 2 rounds of revisions. Additional revisions: $X/hour.' This prevents unlimited revision cycles that kill profitability."
  },
  {
    q: "How do I justify high rates to hesitant clients?",
    a: "Focus on value, not hours. 'This will save you 6 months of internal hiring' or 'This reduces your AWS costs by $2k/month.' If a client questions your rate, they're not the right fit—move on. Quality clients understand quality pricing."
  },
  {
    q: "What if I'm just starting and have no experience?",
    a: "Start at $25-40/hr to build portfolio and testimonials. After 5-10 strong projects and reviews, raise to $60-80/hr. After 50+ projects and a solid reputation, move to $100+/hr. Experience and reviews = justification for higher rates."
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
