'use client';

import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import FolderList from '@/Logic/Folder/FolderList';
import FileList from '@/Logic/File/FileList';

import { useToken } from '@/Auth/Token';
import { useLogout } from '@/Auth/Logout';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const { checkAuthentication, scheduleTokenRefresh } = useToken();
  const { handleLogout } = useLogout(client);

  useEffect(() => {
    const authenticate = async () => {
      await checkAuthentication();
      const cleanup = scheduleTokenRefresh();
      setLoading(false);

      return () => cleanup(); // Cleanup interval on unmount
    };

    authenticate();
  }, [checkAuthentication, scheduleTokenRefresh]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ padding: '20px' }}>
        <h2>Folders</h2>
        <FolderList />
      </div>
      <div style={{ marginTop: '40px' }}>
        <h2>Files</h2>
        <FileList />
      </div>
      <button onClick={handleLogout} style={{ padding: 10, margin: '10px' }}>
        Logout
      </button>
    </div>
  );
}
