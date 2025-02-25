'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/Utils/cn';
import { RightClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import Sidebar from '@/Components/Navigator/Sidebar';
import { useToken } from '@/Server/Auth/Token';
import Nesto from '@/Components/Navigator/Tools/Right_Click';
// import Shelf from '@/Components/Navigator/Tools/SideTool/Shelf';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const isResizing = useRef(false);
  const sidebarRef = useRef(null);
  const navbarRef = useRef(null);
  const resizerRef = useRef(null);
  const { setContextMenuVisible } = RightClick();

  const { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh } =
    useToken();

  // Define hit area margin (in pixels)
  const hitAreaMargin = 20; // This will be applied on both sides of the 1px line

  const rightClick = () => {
    if (setContextMenuVisible) {
      setContextMenuVisible(false);
    }
  };

  const mousePress = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.style.cursor = 'ew-resize';

    // Record starting mouse X and current sidebar width
    startXRef.current = e.clientX;
    if (sidebarRef.current) {
      startWidthRef.current = sidebarRef.current.offsetWidth;
    }

    isResizing.current = true;
    // Fire the movement immediately to reduce lag
    handleMouseMove(e);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', mouseRelease);
  };

  const mouseRelease = () => {
    document.body.style.cursor = 'default';
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', mouseRelease);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    requestAnimationFrame(() => {
      const diff = e.clientX - startXRef.current;
      let newWidth = startWidthRef.current + diff;

      if (newWidth < 240) newWidth = 240;
      if (newWidth > 700) newWidth = 700;

      if (sidebarRef.current) {
        sidebarRef.current.style.width = `${newWidth}px`;
      }

      if (navbarRef.current) {
        navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
        navbarRef.current.style.left = `${newWidth}px`;
      }

      // Update the resizer's left position so its center is at the sidebar's edge
      if (resizerRef.current) {
        resizerRef.current.style.left = `${newWidth - hitAreaMargin}px`;
      }
    });
  };

  useEffect(() => {
    let cleanup;
    let isMounted = true;

    const authenticate = async () => {
      try {
        await checkAuthentication();
        if (isMounted) {
          setLoading(false);
          cleanup = scheduleTokenRefresh();
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    authenticate();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
      cancelTokenRefresh();
    };
  }, [checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    // Make the container relative so the resizer handle can be absolutely positioned over both sidebar and content
    <div className="flex overflow-hidden relative" onClick={rightClick}>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar bg-gray-800 h-screen flex relative overflow-y-auto z-[99999]'
        )}
        // Set an initial width (this can be adjusted as needed)
        style={{ width: '280px' }}
      >
        <Sidebar />
        <Nesto />
        {/* <Shelf /> */}
      </aside>

      <div
        ref={resizerRef}
        onMouseDown={mousePress}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          // Total clickable width is 1px (the visible line) plus hit area on both sides
          width: `${1 + hitAreaMargin * 2}px`,
          // Initially position at sidebar's right edge (adjusted later in handleMouseMove)
          left: sidebarRef.current
            ? `${sidebarRef.current.offsetWidth - hitAreaMargin}px`
            : 0,
          cursor: 'ew-resize',
          zIndex: 100000, // Ensure it overlays other content
        }}
      >
        {/* The visible 1px line, centered in the hit area */}
        <div
          style={{
            position: 'absolute',
            left: `${hitAreaMargin}px`,
            top: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: 'gray',
          }}
        />
      </div>

      <div ref={navbarRef}>
        <File />
      </div>
    </div>
  );
}
