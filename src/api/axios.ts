import axios from 'axios';
import { AUTH_TOKEN_KEY } from '../stores/authSlice';
import { getItem } from '../lib/storage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

export default api;
