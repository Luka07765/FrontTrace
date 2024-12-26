'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/Utils/cn';
import { RightClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/NotePage';
import Sidebar from '@/Components/Navigator/Sidebar';
import { useToken } from '@/Server/Auth/Token';

export default function Dashboard() {
  const isResizing = useRef(false);

  const sidebarRef = useRef(null);
  const navbarRef = useRef(null);
  const [isReseting, setIsReseting] = useState(false);

  const [loading, setLoading] = useState(true);

  const { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh } =
    useToken();
  const { setContextMenuVisible } = RightClick();

  useEffect(() => {
    let cleanup; // To store the cleanup function returned by scheduleTokenRefresh
    let isMounted = true; // Flag to track if the component is still mounted

    const authenticate = async () => {
      try {
        await checkAuthentication();
        if (isMounted) {
          setLoading(false);
          cleanup = scheduleTokenRefresh(); // Schedule token refresh after authentication
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
      cancelTokenRefresh(); // Ensure any remaining intervals are cleared
    };
  }, [checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleClick = () => {
    if (setContextMenuVisible) {
      setContextMenuVisible(false);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    let newWidth = e.clientX;

    // Limit the sidebar width to a minimum of 240px and a maximum of 480px
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
    }

    if (navbarRef.current) {
      navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
      navbarRef.current.style.left = `${newWidth}px`;
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="h-screen w-screen overflow-hidden" onClick={handleClick}>
      <div>
        <h1 role="button" className={cn('bg-white w-20')}>
          helo
        </h1>
      </div>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full relative flex w-60 overflow-y-auto z-[99999]',
          isReseting && 'transition-all ease-in-out duration-300'
        )}
      >
        <Sidebar />
        <div
          onMouseDown={handleMouseDown}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-gray-300 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isReseting && 'transition-all ease-in-out duration 300'
        )}
      >
        <File />
      </div>
    </div>
  );
}
