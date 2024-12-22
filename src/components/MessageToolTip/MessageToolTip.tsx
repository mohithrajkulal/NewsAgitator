import React, { useState } from 'react';
import styles from './tooltip.module.css';

const MessageWithTooltip = ({ message }: { message: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={styles.messageContainer}>
      <p className={styles.description}>
        {message.length > 120 ? `${message.substring(0, 120)}` : message}
        {message.length > 120 && (
          <span
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={styles.dots}
          >
            ...
          </span>
        )}
      </p>

      {showTooltip && <div className={styles.tooltip}>{message}</div>}
    </div>
  );
};

export default MessageWithTooltip;
