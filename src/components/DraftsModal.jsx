import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ConfirmDialog from './ConfirmDialog';
import styles from './DraftsModal.module.css';

export default function DraftsModal({ isOpen, onClose, drafts, onLoadDraft, onDeleteDraft }) {
  const [draftToDelete, setDraftToDelete] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setDraftToDelete(null);
    }
  }, [isOpen]);

  useEffect(() => {
    // Close modal on Escape key press
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Saved Drafts</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {drafts.length === 0 ? (
            <p className={styles.empty}>No saved drafts yet. Click "Save Draft" in the header to save your current quote.</p>
          ) : (
            <div className={styles.draftList}>
              {drafts.map((draft) => (
                <div key={draft.id} className={styles.draftItem}>
                  <div className={styles.draftInfo}>
                    <div className={styles.draftName}>{draft.name}</div>
                    <div className={styles.draftMeta}>
                      {draft.data.clientName && <span>{draft.data.clientName}</span>}
                      {draft.data.projectName && <span>{draft.data.projectName}</span>}
                      <span className={styles.draftDate}>
                        {new Date(draft.createdAt).toLocaleDateString()} {new Date(draft.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className={styles.draftActions}>
                    <button
                      className={styles.loadBtn}
                      onClick={() => {
                        onLoadDraft(draft);
                        onClose();
                      }}
                    >
                      Load
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDraftToDelete(draft)}
                      title="Delete this draft"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!draftToDelete}
        title="Delete Draft?"
        message={`Delete "${draftToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={() => {
          if (draftToDelete) {
            onDeleteDraft(draftToDelete.id);
            setDraftToDelete(null);
            setTimeout(() => {
              if (drafts.length === 0) {
                onClose();
              }
            }, 500)
          }
        }}
        onCancel={() => setDraftToDelete(null)}
      />
    </div>,
    document.body
  );
}
