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
export default api;