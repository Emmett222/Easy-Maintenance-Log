import axios from 'axios';

// Axios.
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Runs before every request sent to Django.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (userData: Record<string, string>) => {
    const response = await api.post('/register/', userData);
    return response.data;
}

export const loginUser = async (credentials: Record<string, string>) => {
  const response = await api.post('/token/', credentials);
  
  const { access, refresh } = response.data;
  
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  
  return response.data;
};

export default api;