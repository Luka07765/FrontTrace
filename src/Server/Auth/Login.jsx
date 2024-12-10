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
      const response = await axios.post(
        'http://localhost:5044/api/Auth/Login',
        { email, password }
      );

      // Store tokens
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // Redirect to the notes page
      router.push('/notebook/notes');
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        console.error('Login failed:', error);
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
}
