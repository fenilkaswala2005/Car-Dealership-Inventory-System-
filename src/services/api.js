import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export const vehicleService = {
  getAll: async (skip = 0, limit = 100) => {
    const response = await api.get(`/vehicles?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  search: async (params) => {
    const queryParams = new URLSearchParams();
    if (params.make) queryParams.append('make', params.make);
    if (params.model) queryParams.append('model', params.model);
    if (params.category) queryParams.append('category', params.category);
    if (params.min_price) queryParams.append('min_price', params.min_price);
    if (params.max_price) queryParams.append('max_price', params.max_price);

    const response = await api.get(`/vehicles/search?${queryParams.toString()}`);
    return response.data;
  },
  create: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },
  update: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
};

export const inventoryService = {
  purchase: async (id, quantity = 1) => {
    const response = await api.post(`/vehicles/${id}/purchase`, { quantity });
    return response.data;
  },
  restock: async (id, quantity = 1) => {
    const response = await api.post(`/vehicles/${id}/restock`, { quantity });
    return response.data;
  },
};

export default api;
