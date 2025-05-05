// hooks/useAutoSave.js
import { useRef, useEffect } from "react";
import { getHasTyped, setHasTyped } from "@/Utils/type";

export const useAutoSave = (saveAction, inactiveDelay = 500, activeInterval = 5000) => {
  const intervalRef = useRef(null);   
  const timeoutRef = useRef(null);    

  const saveNow = () => {
    if (getHasTyped()) {
      saveAction();
      setHasTyped(false);
 
    }
  };
  const stopActiveSave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const triggerSave = () => {

    if (!getHasTyped()) setHasTyped(true);
    

 
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
   
      saveNow();
      stopActiveSave(); 
    }, inactiveDelay);

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
   
        saveNow();
      }, activeInterval);
    }
  };



  useEffect(() => {
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { triggerSave };
};
