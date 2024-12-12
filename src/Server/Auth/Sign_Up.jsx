import axios from 'axios';
import { useRouter } from 'next/navigation';

export function useRegisterLogic(username, email, password, setIsLoading) {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!username || !email || !password) {
      alert('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    const registerData = {
      username,
      email,
      password,
    };

    try {
      await axios.post(
        'https://localhost:7167/api/Auth/Register',
        registerData
      );
      alert('Registration successful! Please log in.');
      router.push('home/auth/login');
    } catch (error) {
      console.error('There was an error registering!', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
}
