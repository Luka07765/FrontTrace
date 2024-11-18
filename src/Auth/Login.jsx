import axios from 'axios';

export default async function Login(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Forward the login request to the authentication backend
    const response = await axios.post('http://localhost:5044/api/Auth/Login', {
      email,
      password,
    });

    // Return the access token to the client
    res.status(200).json({ accessToken: response.data.accessToken });
  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);

    // Return appropriate error messages to the client
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res
      .status(500)
      .json({ message: 'Something went wrong. Please try again.' });
  }
}
