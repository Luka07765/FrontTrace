// useToken.js or useToken.jsx

import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useToken() {
  const router = useRouter();
  let isRefreshing = false;

  // Function to refresh the token
  const refreshToken = async () => {
    if (isRefreshing) return;

    isRefreshing = true;

    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshResponse = await axios.post(
        'http://localhost:5044/api/Auth/RefreshToken',
        { refreshToken: storedRefreshToken }
      );

      // Store new tokens
      localStorage.setItem('token', refreshResponse.data.accessToken);
      localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
    } catch (error) {
      console.error(
        'Failed to refresh token:',
        error.response?.data || error.message
      );

      // Clear tokens and redirect on failure
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      router.push('/home/auth/login');
    } finally {
      isRefreshing = false;
    }
  };

  // Function to check authentication
  const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      await axios.get('http://localhost:5044/api/Auth/ValidateToken', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Token validation failed:', error);
      // Attempt to refresh the token if validation fails
      await refreshToken();
    }
  };

  // Function to schedule token refresh
  const scheduleTokenRefresh = () => {
    const refreshIntervalDuration = 10000; // 14 minutes

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, refreshIntervalDuration);

    return () => clearInterval(refreshInterval);
  };

  // Ensure all functions are returned
  return { checkAuthentication, scheduleTokenRefresh };
}
