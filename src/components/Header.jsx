// src/components/Header.jsx
import React, { useRef, useState } from 'react';
import DraftsModal from './DraftsModal';
import Toast from './Toast';
import styles from './Header.module.css';

export default function Header({
  onExport, exporting,
  saveDraft, loadDraft, loadDraftFromStorage, getSavedDrafts, deleteDraft,
  clientName, projectName
}) {
  const fileInputRef = useRef(null);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [draftsRefresh, setDraftsRefresh] = useState(0);

  const handleLoadDraft = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      loadDraft(file);
    }
    e.target.value = '';
  };

  const handleSaveDraft = () => {
    // Auto-generate draft name from client/project name and current date
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const draftName = `draft-${clientName || 'untitled'}-${projectName || 'project'}-${date}`;
    saveDraft(draftName);

    // Show success toast
    setToastMessage('Draft saved successfully');
    setShowToast(true);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.mark}>✦</span> DevPricer
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.draftBtn} onClick={() => handleSaveDraft()} title="Download quote as JSON">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 13v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6"/>
              <polyline points="12 17 12 3"/>
              <polyline points="18 9 12 3 6 9"/>
            </svg>
            Save Draft
          </button>
          <button className={styles.draftBtn} onClick={() => setShowDraftsModal(true)} title="Load saved drafts">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Load Draft
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleLoadDraft}
            style={{ display: 'none' }}
          />
          <DraftsModal
            key={draftsRefresh}
            isOpen={showDraftsModal}
            onClose={() => setShowDraftsModal(false)}
            drafts={getSavedDrafts()}
            onLoadDraft={loadDraftFromStorage}
            onDeleteDraft={(draftId) => {
              deleteDraft(draftId);
              setDraftsRefresh(prev => prev + 1);
            }}
          />
          <button className={styles.exportBtn} onClick={onExport} disabled={exporting}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            {exporting ? 'Generating…' : 'Export PDF'}
          </button>
        </div>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </header>
  );
}