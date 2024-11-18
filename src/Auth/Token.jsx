import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useToken() {
  const router = useRouter();

  // Function to check authentication and redirect if invalid
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
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log('Access token is valid.');
    } catch (error) {
      console.error('Token validation failed:', error);

      if (error.response?.status === 401) {
        console.log('Token expired. Redirecting to login...');
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };

  // Function to schedule token refresh every 10 seconds
  const scheduleTokenRefresh = () => {
    const refreshInterval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No access token found, skipping refresh.');
        return;
      }

      try {
        console.log('Attempting to refresh token...');
        const refreshResponse = await axios.post(
          'http://localhost:5044/api/Auth/RefreshToken',
          {},
          { withCredentials: true }
        );
        const newToken = refreshResponse.data.AccessToken;
        console.log('Token refreshed successfully:', newToken);
        localStorage.setItem('token', newToken);
      } catch (error) {
        console.error(
          'Failed to refresh token:',
          error.response?.data || error.message
        );
        localStorage.removeItem('token');
        clearInterval(refreshInterval); // Stop the interval on failure
        router.push('/login');
      }
    }, 1000000); // Refresh token every 10 seconds

    return () => clearInterval(refreshInterval); // Cleanup function
  };

  return { checkAuthentication, scheduleTokenRefresh };
}
