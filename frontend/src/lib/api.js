import axios from 'axios';

const PRODUCTION_API = 'https://tekki-web.onrender.com/api';
const PRODUCTION_WS = 'https://tekki-web.onrender.com';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:5000/api';
    }
    return PRODUCTION_API;
  }
  return PRODUCTION_API;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export default api;
