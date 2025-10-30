// mobile-app/src/services/authService.ts
import api from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthData {
  username: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
}

const AUTH_TOKEN_KEY = 'taskflow_jwt';

export const loginUser = async (data: AuthData): Promise<AuthResponse> => {
  // Endpoint de login (deve ser criado no backend Java)
  const response = await api.post<AuthResponse>('/auth/login', data);

  // Salva o token
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.accessToken);

  return response.data;
};

export const registerUser = async (data: AuthData): Promise<string> => {
  // Endpoint de registro (deve ser criado no backend Java)
  const response = await api.post<string>('/auth/register', data); 
  return response.data;
};

export const getToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export const logoutUser = async (): Promise<void> => {
    return AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}