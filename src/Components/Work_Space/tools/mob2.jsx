// hooks/useAutoSave.js
import { useRef, useEffect } from 'react';

export const useAutoSave = (saveAction, typingDelay = 500) => {
  const saveTimeout = useRef(null);

  const triggerSave = (immediate = false) => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    if (immediate) {
      saveAction();
    } else {
      saveTimeout.current = setTimeout(() => {
        saveAction();
      }, typingDelay);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  return { triggerSave };
};