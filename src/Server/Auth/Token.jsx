'use client';
import { useRouter } from 'next/navigation';

import axios from './Api'; 
import { useRef, useCallback } from 'react';

export function useToken() {
  const router = useRouter();
  const refreshIntervalRef = useRef(null);


  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post('/Auth/RefreshToken');

      const { accessToken } = response.data;

      if (!accessToken) {
        throw new Error('Invalid access token received from server.');
      }

      localStorage.setItem('accessToken', accessToken);

      console.log('Access token refreshed successfully.');
      return accessToken; 
    } catch (error) {
      console.error(
        'Failed to refresh token:',
        error.response?.data || error.message
      );

      // Clear access token from localStorage
      localStorage.removeItem('accessToken');

      // Redirect to login page
      router.push('/home/auth/login');

      throw error; // Ensure the caller is aware of the failure
    }
  }, [router]);


  const checkAuthentication = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No access token found. Redirecting to login...');

      router.push('/home/auth/login');
      throw new Error('No access token found!!!'); 
    }

    try {
      await axios.get('/Auth/ValidateToken', {
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
        router.push('/home/auth/login');
        throw refreshError; // Stop further execution
      }
    }
  }, [refreshToken, router]);

  // Function to schedule token refresh
  const scheduleTokenRefresh = useCallback(() => {
    const refreshIntervalDuration = 700000;

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
