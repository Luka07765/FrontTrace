import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useLogout(client) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Logging out...');
      await axios.post(
        'http://localhost:5044/api/Auth/Logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log('Logout successful.');

      // Clear Apollo Client cache
      if (client) {
        await client.clearStore();
      }

      localStorage.removeItem('token');
      router.push('/home/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return { handleLogout };
}
