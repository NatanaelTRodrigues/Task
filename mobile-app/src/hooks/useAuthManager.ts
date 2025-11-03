// mobile-app/src/hooks/useAuthManager.ts
import { useState, useEffect } from 'react';
import { getToken, loginUser, registerUser, logoutUser } from '@/services/authService';

interface AuthData {
  username: string;
  password: string;
}

// Hook Customizado Simples: Retorna o estado e as funções.
export function useAuthManager() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const token = await getToken();
      if (token) {
        // Mocka o usuário
        setUser({ id: 1, username: 'mockUser' }); 
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(data: AuthData) {
    await loginUser(data);
    setUser({ id: 1, username: data.username }); 
  }

  async function signUp(data: AuthData) {
    await registerUser(data);
    await signIn(data); 
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