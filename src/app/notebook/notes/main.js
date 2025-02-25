'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/Utils/cn';
import { RightClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import Sidebar from '@/Components/Navigator/Sidebar';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/Right_Click';
import useResizable from './tools/Resize-Bar';
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { sidebarRef, contentRef, resizerRef, handleMouseDown } =
    useResizable();
  const { setContextMenuVisible } = RightClick();
  const { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh } =
    useToken();

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
    <div
      className="relative flex h-screen overflow-hidden"
      onClick={() => setContextMenuVisible(false)}
    >
      <aside
        ref={sidebarRef}
        className={cn(
          ' bg-gray-800 h-screen relative overflow-y-auto z-[1000]'
        )}
        style={{ width: '280px' }}
      >
        <Sidebar />
        <ContextMenu />
      </aside>

      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0 w-[41px] cursor-ew-resize z-[1001]"
        style={{ left: '260px' }}
      >
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-600 transition-colors duration-200 ease-in-out" />
      </div>

      <div
        ref={contentRef}
        style={{ left: '280px', width: 'calc(100% - 280px)' }}
      >
        <File />
      </div>
    </div>
  );
}
