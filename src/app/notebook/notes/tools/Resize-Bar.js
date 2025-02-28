import { useRef, useEffect } from 'react';

const useResizable = (initialWidth = 280, min = 240, max = 700) => {
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const resizerRef = useRef(null);
  const state = useRef({
    isResizing: false,
    startX: 0,
    startWidth: initialWidth,
  });
  const hitAreaMargin = 20;

  const updateLayout = (width) => {
    if (sidebarRef.current) sidebarRef.current.style.width = `${width}px`;
    if (contentRef.current) {
      contentRef.current.style.width = `calc(100% - ${width}px)`;
      contentRef.current.style.left = `${width}px`;
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.body.style.cursor = 'ew-resize';
    state.current = {
      isResizing: true,
      startX: e.clientX,
      startWidth: sidebarRef.current?.offsetWidth || initialWidth,
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!state.current.isResizing) return;

    requestAnimationFrame(() => {
      const diff = e.clientX - state.current.startX;
      const newWidth = Math.min(
        max,
        Math.max(min, state.current.startWidth + diff)
      );
      updateLayout(newWidth);

      if (resizerRef.current) {
        resizerRef.current.style.left = `${newWidth - 20}px`;
      }
    });
  };

  const handleMouseUp = () => {
    document.body.style.cursor = 'default';
    state.current.isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => updateLayout(initialWidth), [initialWidth]);

  return { sidebarRef, contentRef, resizerRef, handleMouseDown };
};

export default useResizable;
