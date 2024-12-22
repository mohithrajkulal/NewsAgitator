import React from 'react';
import styles from './customModal.module.css';

interface CustomModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const CustomModal = ({ isOpen, children }: CustomModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
