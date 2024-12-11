import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useLogout(client) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('No access token found. Skipping server logout.');
      } else {
        await axios.post(
          'http://localhost:5044/api/Auth/Logout',
          {}, // Assuming no request body is needed
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Logout successful.');
      }

      // Clear Apollo Client cache if needed
      if (client) {
        console.log('Clearing Apollo Client cache...');
        await client.clearStore();
      }

      // Redirect after logout
      setTimeout(() => {
        router.push('/home/auth/login');
      }, 1000); // Adjust the delay as needed
    } catch (error) {
      console.error(
        'Error during logout:',
        error.response?.data || error.message
      );

      // Redirect after logging the error
      setTimeout(() => {
        router.push('/home/auth/login');
      }, 1000);
    }
  };

  return {
    handleLogout,
  };
}
