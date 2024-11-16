'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        await axios.get('http://localhost:5044/api/Auth/ValidateToken', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(false);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    checkAuthentication();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5044/api/Auth/Logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('token'); // Clear token after successful logout
      router.push('/login'); // Redirect to login page
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
      <button onClick={handleLogout} style={{ padding: 10, margin: '20px 0' }}>
        Logout
      </button>
      {/* Rest of the component */}
    </div>
  );
}
