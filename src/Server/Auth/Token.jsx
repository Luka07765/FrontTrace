// Token.jsx
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useToken() {
  const router = useRouter();

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refreshToken');

      if (!currentRefreshToken) {
        console.error('No refresh token available.');
        throw new Error('No refresh token available.');
      }

      const response = await axios.post(
        'http://localhost:5044/api/Auth/RefreshToken',
        { refreshToken: currentRefreshToken }, // JSON object
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { accessToken, refreshToken } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error('Invalid tokens received from server.');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('Tokens refreshed successfully.');
      return accessToken; // Return new access token
    } catch (error) {
      console.error(
        'Failed to refresh token:',
        error.response?.data || error.message
      );

      // Clear tokens and redirect to login page
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Redirect to login

      throw error; // Ensure caller is aware of failure
    }
  };

  // Function to check authentication
  const checkAuthentication = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No access token found. Redirecting to login...');

      return;
    }

    try {
      await axios.get('http://localhost:5044/api/Auth/ValidateToken', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Access token is valid.');
    } catch (error) {
      console.error('Token validation failed:', error);

      // Attempt to refresh the token if validation fails
      try {
        await refreshToken();
      } catch (refreshError) {
        console.error('Failed to refresh token. Redirecting to login...');
      }
    }
  };
  const cancelTokenRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  // Function to schedule token refresh
  const scheduleTokenRefresh = () => {
    const refreshIntervalDuration = 5000; // 14 minutes
    const refreshInterval = setInterval(() => {
      refreshToken();
    }, refreshIntervalDuration);

    return () => clearInterval(refreshInterval);
  };

  return { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh };
}
