import { BaseModal } from './base-modal';
import styles from './confirm-modal.module.css';

interface ConfirmModalProps {
  title: string;
  content: string;
  closeBtnText: string;
  confirmBtnText: string;
  onClose: () => void;
  onConfirm: () => void;
  closeOnlyByAction?: boolean;
}

export const ConfirmModal = ({
  title,
  content,
  closeBtnText,
  confirmBtnText,
  onClose,
  onConfirm,
  closeOnlyByAction = true,
}: ConfirmModalProps) => {
  return (
    <BaseModal name="confirm-modal" closeOnlyByAction={closeOnlyByAction}>
      <div className={styles.modalWrapper}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <div className={styles.modalContent}>{content}</div>
        <div className={styles.buttonGroup}>
          <button className={styles.modalButton} onClick={onClose}>
            {closeBtnText}
          </button>

          <button className={`${styles.modalButton} ${styles.primary}`} onClick={onConfirm}>
            {confirmBtnText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
