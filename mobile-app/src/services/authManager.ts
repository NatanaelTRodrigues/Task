// src/services/authManager.ts
import { useState, useEffect } from 'react';
import { getToken, loginUser, registerUser, logoutUser } from './authService'; // Importa do serviço local

interface AuthData {
  username: string;
  password: string;
}

// Este hook simples gerencia o estado localmente
export function useAuthManager() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega o token ao iniciar
    async function loadStorageData() {
      const token = await getToken();
      if (token) {
        setUser({ id: 1, username: 'mockUser' }); 
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(data: AuthData) {
    try {
        await loginUser(data);
        setUser({ id: 1, username: data.username }); 
    } catch (error) {
        console.error('Login failed', error);
        throw error;
    }
  }

  async function signUp(data: AuthData) {
    try {
        await registerUser(data);
        await signIn(data); 
    } catch (error) {
        console.error('Registration failed', error);
        throw error;
    }
  }

  function signOut() {
    logoutUser();
    setUser(null);
  }

  return {
    signed: !!user,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}