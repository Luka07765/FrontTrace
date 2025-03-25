// api.js or wherever you configure Axios
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
