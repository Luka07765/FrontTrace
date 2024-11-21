// useToken.js or useToken.jsx

import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useToken() {
  const router = useRouter();
  let isRefreshing = false;

  // Function to refresh the token
  const refreshToken = async () => {
    if (isRefreshing) {
      console.log('Token refresh already in progress.');
      return;
    }

    isRefreshing = true;

    try {
      console.log('Attempting to refresh token...');
      const refreshResponse = await axios.post(
        'http://localhost:5044/api/Auth/RefreshToken',
        {}, // Empty body
        { withCredentials: true }
      );

      const newAccessToken = refreshResponse.data.AccessToken;
      console.log('Token refreshed successfully:', newAccessToken);
      localStorage.setItem('token', newAccessToken);
    } catch (error) {
      console.error(
        'Failed to refresh token:',
        error.response?.data || error.message
      );
      localStorage.removeItem('token');
      router.push('/auth/login');
    } finally {
      isRefreshing = false;
    }
  };

  // Function to check authentication
  const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No access token found. Redirecting to login...');
      router.push('/auth/login');
      return;
    }

    try {
      console.log('Validating access token...');
      await axios.get('http://localhost:5044/api/Auth/ValidateToken', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log('Access token is valid.');
    } catch (error) {
      console.error('Token validation failed:', error);
      // Attempt to refresh the token if validation fails
      await refreshToken();
    }
  };

  // Function to schedule token refresh
  const scheduleTokenRefresh = () => {
    const refreshIntervalDuration = 5000000; // Refresh token every 14 minutes

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, refreshIntervalDuration);

    // Return a cleanup function to clear the interval
    return () => clearInterval(refreshInterval);
  };

  // Ensure all functions are returned
  return { checkAuthentication, scheduleTokenRefresh };
}
