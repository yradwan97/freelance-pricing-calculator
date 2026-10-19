import { useState, useEffect } from 'react';
import AdSenseUnit from './AdSenseUnit';
import styles from './FloatingAd.module.css';

export default function FloatingAd() {
  const [isOpen, setIsOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 800;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isOpen || !isVisible) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={styles.desktopSidebar}>
        <div className={styles.stickyContainer}>
          <AdSenseUnit slot="9876543210" format="vertical" />
        </div>
      </aside>

      {/* Mobile dismissible panel */}
      <div className={styles.mobilePanel}>
        <button
          className={styles.closeBtn}
          onClick={() => setIsOpen(false)}
          aria-label="Close ad"
        >
          ✕
        </button>
        <div className={styles.mobilePanelContent}>
          <AdSenseUnit slot="9876543210" format="horizontal" />
        </div>
      </div>
    </>
  );
}
