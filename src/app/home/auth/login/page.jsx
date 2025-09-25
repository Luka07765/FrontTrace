'use client';

import { useState } from 'react';
import { useLoginLogic } from '@/Server/AUTH/Login';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit } = useLoginLogic(
    email,
    password,
    setError,
    setIsLoading
  );

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email:</label>
          <br />
          <input
            type="email"
            value={email}
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
