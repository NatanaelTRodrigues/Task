// mobile-app/src/services/authService.ts
import api, { API_BASE_URL } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'taskflow_jwt';

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
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.accessToken);
  return response.data;
};

export const registerUser = async (data: AuthData): Promise<string> => {
  const response = await api.post<string>('/auth/register', data);
  // O backend retorna apenas uma string de sucesso
  return response.data;
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
};
