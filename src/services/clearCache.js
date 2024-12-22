import { TIMESTAMP_KEY } from './../constants';

const initializeTimestamp = () => {
  const currentTime = new Date().getTime();
  if (!localStorage.getItem(TIMESTAMP_KEY)) {
    localStorage.setItem(TIMESTAMP_KEY, currentTime);
  }
};

const clearExpiredStorage = () => {
  const savedTime = localStorage.getItem(TIMESTAMP_KEY);
  const currentTime = new Date().getTime();

  if (savedTime && currentTime - savedTime > 24 * 60 * 60 * 1000) {
    localStorage.clear();
    localStorage.setItem(TIMESTAMP_KEY, currentTime);
  } else {
  }
};

const handleStorageCheck = () => {
  initializeTimestamp();
  clearExpiredStorage();
};

export default handleStorageCheck;
