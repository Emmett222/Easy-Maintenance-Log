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

export const logout = async (navigate: any) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    await axios.post(
      'http://127.0.0.1:8000/api/logout/', 
        {refreshToken},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
    );
  } catch (err) {
    console.error('Logout failed due to an unknown error.');
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate("/"); 
  }
}

export default api;