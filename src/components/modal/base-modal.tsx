'use client';

import { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

import { ModalId } from '@/types/Modal';
import { useModalStore } from '@/store/use-modal-store';
import styles from './base-modal.module.css';

interface BaseModalProps {
  name: ModalId;
  children: React.ReactNode;
  onBeforeClose?: () => boolean;
  closeOnlyByAction?: boolean; // true일 경우 X 버튼과 외부 클릭 모두 비활성화 (사용자 액션으로만 닫기 가능)
}

export const BaseModal = ({
  name,
  children,
  onBeforeClose,
  closeOnlyByAction = false,
}: BaseModalProps) => {
  const { closeModal } = useModalStore(['closeModal']);

  const handleClose = useCallback(() => {
    if (onBeforeClose) {
      const canClose = onBeforeClose();
      if (!canClose) return;
    }
    closeModal(name);
  }, [closeModal, name, onBeforeClose]);

  const handleOverlayClick = useCallback(() => {
    if (!closeOnlyByAction) {
      handleClose();
    }
  }, [closeOnlyByAction, handleClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !closeOnlyByAction) {
        handleClose();
      }
    },
    [closeOnlyByAction, handleClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={styles.modalContainer}>
      <motion.div
        className={styles.modalOverlay}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={handleOverlayClick}
      />
      <motion.div
        className={styles.modalBody}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        initial={{ opacity: 0, y: 20 }}
      >
        {!closeOnlyByAction && (
          <button type="button" className={styles.closeBtn} onClick={handleClose}>
            ✕
          </button>
        )}
        {children}
      </motion.div>
    </div>
  );
};
