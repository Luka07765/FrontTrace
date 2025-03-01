1. Modify useResizable Hook
We'll use a useRef to track the resizing state and modify the class of the inner div inside the resizerRef.

jsx
Copy
Edit
import { useRef, useEffect } from 'react';

const useResizable = (initialWidth = 280, min = 240, max = 700) => {
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const resizerRef = useRef(null);
  const resizerInnerRef = useRef(null); // Track inner div for styling changes
  const isResizingRef = useRef(false);
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
    isResizingRef.current = true;

    // Apply active resizing styles to the inner div
    if (resizerInnerRef.current) {
      resizerInnerRef.current.classList.add('w-1', 'bg-gray-100');
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizingRef.current) return;

    requestAnimationFrame(() => {
      const diff = e.clientX - (sidebarRef.current?.offsetLeft || 0);
      const newWidth = Math.min(max, Math.max(min, diff));
      updateLayout(newWidth);
      if (resizerRef.current) {
        resizerRef.current.style.left = `${newWidth - hitAreaMargin}px`;
      }
    });
  };

  const handleMouseUp = () => {
    document.body.style.cursor = 'default';
    isResizingRef.current = false;

    // Remove active resizing styles from the inner div
    if (resizerInnerRef.current) {
      resizerInnerRef.current.classList.remove('w-1', 'bg-gray-100');
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => updateLayout(initialWidth), [initialWidth]);

  return { sidebarRef, contentRef, resizerRef, resizerInnerRef, handleMouseDown, hitAreaMargin };
};

export default useResizable;
2. Update Dashboard Component
Now, we'll properly use resizerInnerRef inside the Dashboard component.

jsx
Copy
Edit
<div
  ref={resizerRef}
  onMouseDown={handleMouseDown}
  className="absolute top-0 bottom-0 cursor-ew-resize z-[1001] group"
  style={{
    width: `${1 + hitAreaMargin * 2}px`,
    left: sidebarRef.current ? `${sidebarRef.current.offsetWidth - hitAreaMargin}px` : 260,
  }}
>
  <div
    ref={resizerInnerRef} // Now tracking the inner div!
    className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 bg-gray-600 transition-color duration-200 ease-in-out group-hover:w-1 group-hover:bg-gray-100"
    style={{ left: `${hitAreaMargin}px` }}
  />
</div>
