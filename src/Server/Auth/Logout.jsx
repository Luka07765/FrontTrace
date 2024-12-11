// hooks/useLogout.js
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
export function useLogout(client) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Consistent key
      if (token) {
        console.log('Attempting to log out on the server...');
        await axios.post(
          'http://localhost:5044/api/Auth/Logout',
          {}, // No request body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success('Logged out successfully!');
        localStorage.removeItem('accessToken'); // Correct key
        console.log('Access token removed from localStorage.');
      } else {
        console.warn('No access token found. Skipping server logout.');
      }

      // Clear Apollo Client cache if provided
      if (client) {
        console.log('Clearing Apollo Client cache...');
        await client.clearStore();
        console.log('Apollo Client cache cleared.');
      }

      // Redirect immediately after logout
      router.push('/home/auth/login');
    } catch (error) {
      console.error(
        'Error during logout:',
        error.response?.data || error.message
      );

      // Redirect even if an error occurs during logout
      router.push('/home/auth/login');
    }
  };

  return { handleLogout };
}
