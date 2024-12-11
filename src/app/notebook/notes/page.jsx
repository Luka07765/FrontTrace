'use client';

import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Click } from '@/Zustand/Click_Store';
import File from '@/Components/Work_Space/NotePage';
import Sidebar from '@/Components/Navigator/Sidebar';
import { useToken } from '@/Server/Auth/Token';
import { useLogout } from '@/Server/Auth/Logout';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const client = useApolloClient(); // If not used, consider removing
  const router = useRouter();
  const { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh } =
    useToken();
  const { handleLogout } = useLogout(); // Removed client parameter
  const { setContextMenuVisible } = Click();

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

    // Cleanup function
    return () => {
      isMounted = false; // Prevent state updates after unmount
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
    <div onClick={handleClick}>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Logout
      </button>

      <div className="flex">
        <div className="w-1/4 p-4">
          <Sidebar />
        </div>

        <div className="w-3/4 p-4">
          <File />
        </div>
      </div>
    </div>
  );
}
