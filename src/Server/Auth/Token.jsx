// Token.jsx
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useRef, useCallback } from 'react';

export function useToken() {
  const router = useRouter();
  const refreshIntervalRef = useRef(null);

  // Function to refresh the token
  const refreshToken = useCallback(async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refreshToken');

      if (!currentRefreshToken) {
        console.warn('No refresh token available. Redirecting to login...');
        // Clear any existing tokens just in case
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Redirect to login
        router.push('/login'); // Ensure '/login' is your actual login route
        return; // Stop further execution
      }

      // Proceed to refresh the access token
      const response = await axios.post(
        'http://localhost:5044/api/Auth/RefreshToken',
        { refreshToken: currentRefreshToken }, // Ensure this matches the backend model
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      if (!accessToken || !newRefreshToken) {
        console.error(
          'Invalid tokens received from server. Redirecting to login...'
        );
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Redirect to login
        router.push('/login');
        return; // Stop further execution
      }

      // Store the new tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      console.log('Tokens refreshed successfully.');
      return accessToken; // Return the new access token
    } catch (error) {
      console.error(
        'Failed to refresh token:',
        error.response?.data || error.message
      );

      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Redirect to login page
      router.push('/login'); // Ensure '/login' is your actual login route

      throw error; // Ensure the caller is aware of the failure
    }
  }, [router]);

  // Function to check authentication
  const checkAuthentication = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No access token found. Redirecting to login...');
      // Redirect to login
      router.push('/login'); // Ensure '/login' is your actual login route
      throw new Error('No access token found'); // Stop further execution
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
        // Redirect to login
        router.push('/login'); // Ensure '/login' is your actual login route
        throw refreshError; // Stop further execution
      }
    }
  }, [refreshToken, router]);

  // Function to schedule token refresh
  const scheduleTokenRefresh = useCallback(() => {
    const refreshIntervalDuration = 55000; // 14 minutes in milliseconds
    const currentRefreshToken = localStorage.getItem('refreshToken');

    if (!currentRefreshToken) {
      console.log(
        'User logged out or refresh token is expired. No token refresh scheduled.'
      );
      return; // Stop further execution
    }

    refreshIntervalRef.current = setInterval(() => {
      refreshToken();
    }, refreshIntervalDuration);

    console.log('Token refresh scheduled every 14 minutes.');

    return () => clearInterval(refreshIntervalRef.current);
  }, [refreshToken]);

  // Function to cancel token refresh
  const cancelTokenRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      console.log('Token refresh canceled.');
    }
  }, []);

  return { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh };
}
