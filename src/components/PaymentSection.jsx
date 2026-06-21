import React from "react";
import { fmt } from "../utils";
import { PAYMENT_TIPS } from "../hooks/usePricing";
import styles from "./PaymentSection.module.css";

export default function PaymentSection({
  total,
  complexity,
  payments,
  updatePayment,
  addPayment,
  removePayment,
  equalizePayments,
  paymentTotalPct,
  isPaymentValid,
}) {
  const tip = PAYMENT_TIPS[complexity] || "";

  return (
    <section className={styles.section}>
      <div className={styles.label}>05 — Payment structure</div>

      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Payment Schedule</h2>
          <p className={styles.subtitle}>
            Define how project payments will be split across milestones.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={equalizePayments}
          >
            Equalize %
          </button>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={addPayment}
          >
            + Add Payment
          </button>
        </div>
      </div>

      <div className={styles.validationWrapper}>
        <div
          className={`${styles.totalBadge} ${
            isPaymentValid ? styles.valid : styles.invalid
          }`}
        >
          Total: {paymentTotalPct.toFixed(2)}%
        </div>

        {!isPaymentValid && (
          <div className={styles.validationError}>
            Payment percentages must equal exactly 100%.
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {payments.map((payment, index) => (
          <div key={payment.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <input
                value={payment.phase}
                className={styles.phaseInput}
                placeholder="Payment Name"
                onChange={(e) =>
                  updatePayment(payment.id, "phase", e.target.value)
                }
              />

              {payments.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removePayment(payment.id)}
                >
                  ✕
                </button>
              )}
            </div>

            <div className={styles.row}>
              <label>Percentage</label>

              <div className={styles.percentInputWrapper}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={payment.pct}
                  className={styles.percentInput}
                  onChange={(e) =>
                    updatePayment(payment.id, "pct", e.target.value)
                  }
                />

                <span className={styles.percentSign}>%</span>
              </div>
            </div>

            <div className={styles.row}>
              <label>Amount</label>

              <div className={styles.amount}>
                {fmt(total * (payment.pct / 100))}
              </div>
            </div>

            <div className={styles.row}>
              <label>Notes</label>

              <textarea
                rows={4}
                className={styles.noteInput}
                value={payment.note}
                placeholder="Describe when this payment becomes due..."
                onChange={(e) =>
                  updatePayment(payment.id, "note", e.target.value)
                }
              />
            </div>

            <div className={styles.footer}>
              Payment #{index + 1}
            </div>
          </div>
        ))}
      </div>

      {tip && (
        <div className={styles.tipBox}>
          <div className={styles.tipTitle}>Recommendation</div>
          <div>{tip}</div>
        </div>
      )}
    </section>
  );
}