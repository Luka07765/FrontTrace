'use client';

import { useState } from 'react';
import { useRegisterLogic } from '@/Server/Auth/Sign_Up';
import { useRouter } from 'next/navigation';
export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/home/auth/login'); // Navigate to the login page
  };

  const { handleSubmit } = useRegisterLogic(
    username,
    email,
    password,
    setIsLoading
  );

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label className="bg-white">Username:</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label className="bg-white">Email:</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label className="bg-white">Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>{' '}
        <button
          onClick={handleLoginClick}
          className="px-14 py-7 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          back to log in
        </button>
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: 10, width: '100%' }}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
