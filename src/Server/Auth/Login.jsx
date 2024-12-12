'use client';
import api from './Api'; // Use the configured Axios instance
import { useRouter } from 'next/navigation';
// Updated import

export function useLoginLogic(email, password, setError, setIsLoading) {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    try {
      // Send login request with JSON payload
      const response = await api.post('/Auth/Login', { email, password });

      const { accessToken } = response.data;

      // Validate access token
      if (!accessToken) {
        throw new Error('Failed to retrieve access token from the server.');
      }

      // Store access token (consider storing it in memory or a state management library)
      localStorage.setItem('accessToken', accessToken);

      console.log('Login successful. Access token stored.');

      // Redirect to the notes page
      router.push('/notebook/notes');
    } catch (error) {
      // Handle errors
      if (error.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        console.error('Login failed:', error.response?.data || error.message);
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return { handleSubmit };
}
