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
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Logout successful.');
      }

      if (client) {
        console.log('Clearing Apollo Client cache...');
        await client.clearStore();
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      console.log('Redirecting to: /home/auth/login');

      // Add a small delay before redirecting
      setTimeout(() => {
        router.push('/home/auth/login'); // Ensure correct path is pushed
      }, 10000); // 1 second delay
    } catch (error) {
      console.error(
        'Error during logout:',
        error.response?.data || error.message
      );

      // Add a delay here as well, in case an error occurs
      setTimeout(() => {
        router.push('/home/auth/login'); // Redirect after logging the error
      }, 10000);
    }
  };

  return { handleLogout };
}
