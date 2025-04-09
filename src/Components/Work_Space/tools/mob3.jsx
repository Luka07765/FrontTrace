// hooks/useTypingIndicator.js
import { useState, useRef, useEffect } from 'react';

export const useTypingIndicator = (delay = 400) => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);

  const startTyping = () => {
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  return { isTyping, startTyping };
};