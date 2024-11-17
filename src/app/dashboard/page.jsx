'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client'; // Import Apollo Client

import FolderList from '../../Logic/Folder/FolderList';
import FileList from '../../Logic/File/FileList';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const client = useApolloClient(); // Get Apollo Client instance

  const checkAuthentication = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No access token found. Redirecting to login...');
      router.push('/login');
      return;
    }

    try {
      console.log('Validating access token...');
      await axios.get('http://localhost:5044/api/Auth/ValidateToken', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Access token is valid.');
      setLoading(false);
    } catch (error) {
      console.error('Token validation failed:', error);
      if (error.response?.status === 401) {
        console.log('Access token has expired. Attempting refresh...');
        try {
          const refreshResponse = await axios.post(
            'http://localhost:5044/api/Auth/RefreshToken',
            {},
            { withCredentials: true }
          );
          const newToken = refreshResponse.data.AccessToken;
          console.log('Token refreshed successfully:', newToken);
          localStorage.setItem('token', newToken);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('token');
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Logging out...');
      await axios.post(
        'http://localhost:5044/api/Auth/Logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log('Logout successful.');

      // Clear Apollo Client cache
      await client.clearStore();

      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
