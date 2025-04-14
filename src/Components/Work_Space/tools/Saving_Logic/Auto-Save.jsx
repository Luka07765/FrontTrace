// hooks/useAutoSave.js
import { useRef, useEffect } from 'react';

export const useAutoSave = (saveAction, typingDelay = 3000) => {
  const saveTimeout = useRef(null);
  const hasTypedRef = useRef(false);

  const triggerSave = (immediate = false) => {

    if (!hasTypedRef.current) {
      hasTypedRef.current = true;
    
    }
    
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
    if (!hasTypedRef.current) return;

    const interval = setInterval(() => {
      if (hasTypedRef.current) {
        saveAction();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hasTypedRef.current]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  return { triggerSave };
};