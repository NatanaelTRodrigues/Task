// mobile-app/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getToken, loginUser, registerUser, logoutUser } from '@/services/authService';

// Interfaces simplificadas
interface AuthData {
  username: string;
  password: string;
}

interface AuthHook {
  signed: boolean;
  user: { id: number; username: string } | null;
  loading: boolean;
  signIn(data: AuthData): Promise<void>;
  signUp(data: AuthData): Promise<void>;
  signOut(): void;
}

// Hook Customizado: Gerencia o estado e a lógica de autenticação
export function useAuth(): AuthHook {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega o token ao iniciar
    async function loadStorageData() {
      const token = await getToken();
      if (token) {
        // Mocka o usuário (em produção, decodificaria o token)
        setUser({ id: 1, username: 'mockUser' }); 
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  // Funções de Ação

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
  
  // Retorna o estado e as funções para o componente usar
  return {
    signed: !!user,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}