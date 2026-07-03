import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, isVisible, onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className={styles.toast}>
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>{message}</span>
    </div>
  );
}
