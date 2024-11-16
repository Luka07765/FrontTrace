'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState(''); // Change username to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state and start loading
    setError('');
    setIsLoading(true);

    // Basic input validation
    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      return;
    }

    const loginData = {
      email, // Send email instead of username
      password,
    };

    try {
      const response = await axios.post(
        'http://localhost:5044/api/Auth/Login', // Ensure the backend accepts email
        loginData
      );

      // Save the token in localStorage
      localStorage.setItem('token', response.data.accessToken);
      console.log(response.data.accessToken);

      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);

      // Set appropriate error messages
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email:</label> {/* Updated label */}
          <br />
          <input
            type="email" // Updated input type
            value={email} // Updated to use email state
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
            }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4,
            }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <button
          type="submit"
          style={{
            padding: 10,
            width: '100%',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
