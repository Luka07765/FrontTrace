'use client';

import { useEffect, useState, useRef } from 'react';

import { RightClick } from '@/Zustand/Context_Store';
import File from '@/Components/Work_Space/NotePage';
import Sidebar from '@/Components/Navigator/Sidebar';
import { useToken } from '@/Server/Auth/Token';

export default function Dashboard() {
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

  return (
    <div className=" overflow-hidden" onClick={handleClick}>
      <Sidebar />
      <File />
    </div>
  );
}
