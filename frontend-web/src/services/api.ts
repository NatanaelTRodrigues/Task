// frontend-web/src/services/api.ts
import axios from 'axios';

export const API_BASE_URL = "https://congenial-space-eureka-v6gxp46557g736wj6-3000.app.github.dev/"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// CRÍTICO: Adicionar um interceptor para injetar o JWT em cada requisição
api.interceptors.request.use(config => {
  // O token foi salvo no loginUser em /auth/login/page.tsx
  const token = localStorage.getItem('taskflow_jwt'); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;