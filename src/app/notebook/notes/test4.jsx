'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/Utils/cn';
import { RightClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import Sidebar from '@/Components/Navigator/Sidebar';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/Right_Click';

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh } =
    useToken();

  useEffect(() => {
    let isMounted = true;
    let cleanup;

    const authenticate = async () => {
      try {
        await checkAuthentication();
        if (isMounted) {
          setLoading(false);
          cleanup = scheduleTokenRefresh();
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        if (isMounted) setLoading(false);
      }
    };

    authenticate();

    return () => {
      isMounted = false;
      cleanup?.();
      cancelTokenRefresh();
    };
  }, [checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh]);

  return { loading };
};

const useResizable = (initialWidth = 280, min = 240, max = 700) => {
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const resizerRef = useRef(null);
  const state = useRef({
    isResizing: false,
    startX: 0,
    startWidth: initialWidth,
  });

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

export default function Dashboard() {
  const { loading } = useAuth();
  const { setContextMenuVisible } = RightClick();
  const { sidebarRef, contentRef, resizerRef, handleMouseDown } =
    useResizable();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-2xl text-gray-500">
        Loading...
      </div>
    );

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar bg-gray-800 h-screen relative overflow-y-auto z-[1000]',
          'transition-[width] duration-200 ease-in-out'
        )}
        style={{ width: '280px' }}
      >
        <Sidebar />
        <ContextMenu />
      </aside>

      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0 w-[41px] cursor-ew-resize z-[1001] hover:after:bg-blue-500 active:after:bg-blue-500"
        style={{ left: '260px' }}
      >
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-600 transition-colors duration-200 ease-in-out" />
      </div>

      <div
        ref={contentRef}
        className="relative h-screen transition-[left] duration-200 ease-in-out"
        style={{ left: '280px', width: 'calc(100% - 280px)' }}
      >
        <File />
      </div>
    </div>
  );
}
