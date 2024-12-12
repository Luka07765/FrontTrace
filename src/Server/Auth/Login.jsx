import axios from 'axios';
import { useRouter } from 'next/navigation';

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
      const response = await axios.post(
        'https://localhost:7167/api/Auth/Login',
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
