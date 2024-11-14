// pages/register.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Add other fields as required
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registerData = {
      email,
      password,
      // Include other required fields from your RegisterModel
    };

    try {
      await axios.post('http://localhost:5044/api/Auth/Register', registerData);

      alert('Registration successful! Please log in.');
      router.push('/login');
    } catch (error) {
      console.error('There was an error registering!', error);
      alert('Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email:</label>
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
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        {/* Add other fields as necessary */}
        <button type="submit" style={{ padding: 10, width: '100%' }}>
          Register
        </button>
      </form>
    </div>
  );
}
