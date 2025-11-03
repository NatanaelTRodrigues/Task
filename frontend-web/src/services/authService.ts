// frontend-web/src/services/authService.ts
import api from './api';

interface AuthData {
  username: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
}

export const loginUser = async (data: AuthData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const registerUser = async (data: AuthData): Promise<string> => {
  const response = await api.post<string>('/auth/register', data); 
  return response.data;
};