import axios from 'axios';
import { useRouter } from 'next/navigation';

export function useLoginLogic(email, password, setError, setIsLoading) {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      const response = await axios.post(
        `${API_BASE_URL}/Auth/Login`,
        { email, password }, // JSON object
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { accessToken, refreshToken } = response.data;

      // Validate tokens
      if (!accessToken || !refreshToken) {
        throw new Error('Failed to retrieve tokens from the server.');
      }

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('Login successful. Tokens stored.');

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
