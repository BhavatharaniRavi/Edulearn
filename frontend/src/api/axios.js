import axios from 'axios';

const api = axios.create({
  baseURL: 'https://edulearn-7c7m.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;