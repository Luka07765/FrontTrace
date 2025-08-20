// Logout.jsx
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToken } from './Token'; // Adjust the import path as necessary
import { useApolloClient } from '@apollo/client';
export function useLogout() {
  const router = useRouter();
  const { cancelTokenRefresh } = useToken(); 
  const client = useApolloClient();
  const handleLogout = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      router.push('/home/auth/login');

      await axios.post(
        `${API_BASE_URL}/Auth/Logout`,
        {}, 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 
          },
        }
      );
      cancelTokenRefresh();
      localStorage.removeItem('accessToken');

      await client.clearStore();
      console.log('Logout successful. Tokens cleared.');

    
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
  
      localStorage.removeItem('accessToken');

      cancelTokenRefresh();
      router.push('/home/auth/login');
    }
  };

  return { handleLogout };
}
