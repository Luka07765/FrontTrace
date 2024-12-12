// Logout.jsx
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToken } from './Token'; // Adjust the import path as necessary
import { useApolloClient } from '@apollo/client';
export function useLogout() {
  const router = useRouter();
  const { cancelTokenRefresh } = useToken(); // Function to cancel token refresh
  const client = useApolloClient();
  const handleLogout = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      router.push('/home/auth/login');

      await axios.post(
        `${API_BASE_URL}/Auth/Logout`,
        {}, // Assuming no body is needed
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include token if required
          },
        }
      );
      cancelTokenRefresh();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      await client.clearStore();
      console.log('Logout successful. Tokens cleared.');

      // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      // Even if logout fails, clear tokens and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      cancelTokenRefresh();
      router.push('/home/auth/login');
    }
  };

  return { handleLogout };
}
