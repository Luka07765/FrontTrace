'use client';

import { useEffect, useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { RightClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/WorkPage';
import Sidebar from '@/Components/Navigator/Sidebar';
import { useToken } from '@/Server/Auth/Token';

export default function Dashboard() {
  const ref = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh } =
    useToken();
  // Removed client parameter
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
          // Note: Redirection is already handled in the useToken hook
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

  const togglePanel = () => {
    const panel = ref.current;
    if (panel) {
      if (isCollapsed) {
        panel.expand(); // Use expand() to show the panel
      } else {
        panel.collapse();
      }
      setIsCollapsed(!isCollapsed); // Update the collapsed state
    }
  };
  return (
    <div className="h-screen w-screen overflow-hidden" onClick={handleClick}>
      <button onClick={togglePanel}>
        {isCollapsed ? 'Expand Panel' : 'Collapse Panel'}{' '}
        {/* Dynamic button text */}
      </button>

      <PanelGroup direction="horizontal">
        <Panel collapsible ref={ref} defaultSize={20} maxSize={40} minSize={15}>
          <Sidebar />
        </Panel>

        <PanelResizeHandle
          className="w-[2px] h-full bg-slate-600 transition-all duration-300
    hover:w-1 hover:bg-slate-50 active:w-1 active:bg-slate-200 cursor-ew-resize"
          hitAreaMargins={{ coarse: 20, fine: 5 }}
        />

        <Panel minSize={30}>
          <File />
        </Panel>
      </PanelGroup>
    </div>
  );
}
