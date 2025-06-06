'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/Utils/cn';
import { RightClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import Sidebar from '@/Components/Navigator/Sidebar';
import { useToken } from '@/Server/Auth/Token';
import ContextMenu from '@/Components/Navigator/Tools/ContextMenu/Context_Ui';
import useResizable from './tools/Resize-Bar';
import { useLogout } from '@/Server/Auth/Logout';

export default function Dashboard() {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const {
    sidebarRef,
    contentRef,
    resizerRef,
    resizerInnerRef,
    handleMouseDown,
    hitAreaMargin,
  } = useResizable();
  const { setContextMenuVisible } = RightClick();
  const { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh } =
    useToken();
  const { handleLogout } = useLogout();

  useEffect(() => {
    let cleanup;
    let isMounted = true;

    const authenticate = async () => {
      try {
        await checkAuthentication();
        if (isMounted) {
          setLoadingAuth(false);
          cleanup = scheduleTokenRefresh();
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        if (isMounted) {
          setLoadingAuth(false);
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
  if (loadingAuth) {
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
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Logout
        </button>
      </aside>

      <div
        ref={resizerRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0  cursor-ew-resize z-[1001] group"
        style={{
          width: `${1 + hitAreaMargin * 2}px`,
          left: sidebarRef.current
            ? `${sidebarRef.current.offsetWidth - hitAreaMargin}px`
            : 260,
        }}
      >
        <div
          ref={resizerInnerRef}
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0  bg-gray-600 transition-color duration-300 ease-in-out group-hover:w-1 group-hover:bg-white"
          style={{ left: `${hitAreaMargin}px` }}
        />
      </div>

      <div
        ref={contentRef}
        style={{
          left: '260px',
          width: 'calc(100% - 280px)',
          overflow: 'auto',
        }}
      >
        <File />
      </div>
    </div>
  );
}
