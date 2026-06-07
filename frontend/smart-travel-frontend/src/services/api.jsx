import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8800/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically add the Token to every request if it exists in LocalStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const authService = {
  register: (userData) => api.post('/register/', userData),
  login: (credentials) => api.post('/login/', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const travelService = {
  recommendTrip: (data) => api.post('/recommend-trip/', data),
  getHistory: () => api.get('/travel-history/'),
  getPersonalized: () => api.get('/personalized-recommendations/'),
};

export default api;