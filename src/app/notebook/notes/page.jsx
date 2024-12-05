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
  const client = useApolloClient();
  const router = useRouter();
  const { checkAuthentication, scheduleTokenRefresh } = useToken();
  const { handleLogout } = useLogout(client);
  const { setContextMenuVisible } = Click();

  useEffect(() => {
    let cleanup; // Declare cleanup variable in the outer scope

    const authenticate = async () => {
      try {
        await checkAuthentication();
        setLoading(false);
        cleanup = scheduleTokenRefresh(); // Schedule token refresh after authentication
      } catch (error) {
        console.error('Authentication failed:', error);
        setLoading(false);
        router.push('/auth/login'); // Redirect to login on failure
      }
    };

    authenticate();

    // Return the cleanup function directly from useEffect
    return () => {
      if (cleanup) {
        cleanup(); // Cleanup the interval on unmount
      }
    };
  }, [checkAuthentication, scheduleTokenRefresh, router]);

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
        {/* Sidebar on the left */}
        <div className="w-1/4 p-4">
          <Sidebar />
        </div>
        {/* Files on the right */}
        <div className="w-3/4 p-4">
          <h2 className="text-xl font-semibold mb-2">Files</h2>
          <File />
        </div>
      </div>
    </div>
  );
}
