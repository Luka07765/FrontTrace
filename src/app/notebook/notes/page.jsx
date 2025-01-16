'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/Utils/cn';
import { RightClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import Sidebar from '@/Components/Navigator/Sidebar';
import { useToken } from '@/Server/Auth/Token';

import Shelf from '@/Components/Navigator/Tools/SideTool/Shelf';
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const isResizing = useRef(false);
  const navbarRef = useRef(null);
  const sidebarRef = useRef(null);
  const { setContextMenuVisible } = RightClick();

  const { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh } =
    useToken();

  const rightClick = () => {
    if (setContextMenuVisible) {
      setContextMenuVisible(false);
    }
  };
  const mousePress = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', mouseRelease);
  };

  const mouseRelease = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', mouseRelease);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    let newWidth = e.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 700) newWidth = 700;

    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
    }

    if (navbarRef.current) {
      navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
      navbarRef.current.style.left = `${newWidth}px`;
    }
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
      if (cleanup) {
        cleanup();
      }
      cancelTokenRefresh();
    };
  }, [checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh]);
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex overflow-hidden" onClick={rightClick}>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar bg-gray-800  h-screen flex relative overflow-y-auto z-[99999]  w-70'
        )}
      >
        {' '}
        <Sidebar />
        {/* <Shelf /> */}
        <div
          onMouseDown={mousePress}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-gray-300 right-0 top-0"
        />
      </aside>

      <div ref={navbarRef} className="w-3/4 p-4">
        <File />
      </div>
    </div>
  );
}
