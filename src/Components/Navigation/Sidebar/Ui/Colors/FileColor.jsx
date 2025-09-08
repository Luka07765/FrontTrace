import { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';

export const useFileColor = (file, updateFileColor, handleUpdateFile) => {
  const [localColor, setLocalColor] = useState(file.colors);


  const cycleColor = (color) => {
    const order = ['Green', 'Yellow', 'Red'];
    const i = order.indexOf(color);
    return order[(i + 1) % order.length];
  };


  const debouncedUpdate = useRef(
    debounce(async (updateData, rollback) => {
      try {
        await handleUpdateFile(updateData);
      } catch (err) {
        console.error('Failed to update color', err);
        rollback(); 
      }
    }, 500)
  ).current;


  useEffect(() => {
    return () => debouncedUpdate.cancel();
  }, [debouncedUpdate]);


  const onColorClick = (e) => {
    e.stopPropagation();
    const newColor = cycleColor(localColor);
    const prevColor = localColor;

    setLocalColor(newColor); 
    updateFileColor(file.id, newColor); 


    debouncedUpdate(
      { id: file.id, colors: newColor },
      () => setLocalColor(prevColor)
    );
  };


  const dotClass = {
    Red: 'bg-red-500',
    Yellow: 'bg-yellow-500',
    Green: 'bg-green-500',
  }[localColor] || 'bg-gray-400';

  return { localColor, onColorClick, dotClass };
};
