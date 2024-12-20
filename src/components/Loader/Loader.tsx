import React from 'react';
import styles from './loader.module.css';

export const Loader = () => {
  return (
    <div className={styles.loaderConatiner}>
      <div className={styles.loader} />
    </div>
  );
};
