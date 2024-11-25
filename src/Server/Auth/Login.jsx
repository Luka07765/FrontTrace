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
        {
          email,
          password,
        }
      );

      localStorage.setItem('token', response.data.accessToken);
      router.push('/workspace/notes');
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
}
