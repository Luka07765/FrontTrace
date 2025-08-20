// hooks/useAutoSave.js
import { useRef, useEffect } from "react";
import { getHasTyped, setHasTyped } from "@/Utils/type";

export const useAutoSave = (saveAction, inactiveDelay = 1500, activeInterval = 7000) => {
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
      const handleBeforeUnload = (e) => {
    if (getHasTyped()) {
      e.preventDefault();
      e.returnValue = ""; 
    }
  };

    const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden" && getHasTyped()) {
      
        saveNow();
    }
  };  
  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { triggerSave,saveNow };
};
