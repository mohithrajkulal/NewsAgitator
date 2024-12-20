import React from 'react';
import styles from './customModal.module.css';

const CustomModal = ({ isOpen, children }: any) => {
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
