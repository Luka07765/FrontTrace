import { useRef, useEffect } from 'react';

const useResizable = (initialWidth = 280, min = 40, max = 400) => {
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const resizerRef = useRef(null);
  const resizerInnerRef = useRef(null);
  const hitAreaMargin = 20;
  
  const state = useRef({
    isResizing: false,
    startX: 0,
    startWidth: initialWidth,
  });


  const moveContent = (width) => {
    if (sidebarRef.current) sidebarRef.current.style.width = `${width}px`;
    if (contentRef.current) {
      contentRef.current.style.width = `calc(100% - ${width}px)`;
      contentRef.current.style.left = `${width}px`;
    }
  };

    const handleMouseUp = () => {
    document.body.style.cursor = 'default';
    state.current.isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    if (resizerInnerRef.current) {
      resizerInnerRef.current.classList.remove('w-1', 'bg-white');
    }
  };

  const handleMouseMove = (e) => {
    if (!state.current.isResizing) return;

    requestAnimationFrame(() => {
      const diff = e.clientX - state.current.startX;
      const newWidth = Math.min(
        max,
        Math.max(min, state.current.startWidth + diff)
      );
      moveContent(newWidth);

      if (resizerRef.current) {
        resizerRef.current.style.left = `${newWidth - hitAreaMargin}px`;
      }
    });
  };



    const mouseHold = (e) => {
    e.preventDefault();
    document.body.style.cursor = 'ew-resize';
    state.current = {
      isResizing: true,
      startX: e.clientX,
      startWidth: sidebarRef.current?.offsetWidth || initialWidth,
    };
    if (resizerInnerRef.current) {
      resizerInnerRef.current.classList.add('w-1', 'bg-white');
    }




    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };



  useEffect(() => moveContent(initialWidth), [initialWidth]);

  return {
    sidebarRef,
    contentRef,
    resizerRef,
    mouseHold,
    hitAreaMargin,
    resizerInnerRef
  };
};
export default useResizable;