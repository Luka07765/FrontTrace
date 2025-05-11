'use client';
import { useRouter } from 'next/navigation';
import axios from './Api'; 
import { useRef, useCallback } from 'react';

export function useToken() {
  const router = useRouter();
  const refreshIntervalRef = useRef(null);

  const refreshToken = useCallback(async () => {
    try {
      // Get refresh token from storage (adjust if using httpOnly cookie)
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post('/Auth/RefreshToken', { 
        refreshToken, // Send refresh token in the request body
      }, {
        withCredentials: true, // Required if using httpOnly cookies
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      if (!accessToken) {
        throw new Error('Invalid access token received from server.');
      }

      // Store new tokens
      localStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      console.log('Access token refreshed successfully.');
      return accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error.response?.data || error.message);
      
      // Clear tokens and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/home/auth/login');
      
      throw error;
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
        withCredentials: true, // Required if using cookies
      });
      console.log('Access token is valid.');
    } catch (error) {
      console.error('Token validation failed:', error);
      try {
        await refreshToken(); // Attempt refresh
      } catch (refreshError) {
        console.error('Failed to refresh token. Redirecting to login...');
        router.push('/home/auth/login');
        throw refreshError;
      }
    }
  }, [refreshToken, router]);

  // Schedule token refresh (every 14 minutes)
  const scheduleTokenRefresh = useCallback(() => {
    const refreshIntervalDuration = 5000; // 14 minutes in ms

    refreshIntervalRef.current = setInterval(() => {
      refreshToken().catch(console.error);
    }, refreshIntervalDuration);

    console.log('Token refresh scheduled every 14 minutes.');

    return () => clearInterval(refreshIntervalRef.current);
  }, [refreshToken]);

  const cancelTokenRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      console.log('Token refresh canceled.');
    }
  }, []);

  return { checkAuthentication, scheduleTokenRefresh, cancelTokenRefresh };
}