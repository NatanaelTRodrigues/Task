// frontend-web/src/app/auth/login/page.tsx
'use client'; 

import React, { useState } from 'react';
import Input from '@/components/Input';
import { loginUser } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser({ username, password });
      
      // CRÍTICO: Salvar o JWT para uso futuro em rotas protegidas
      localStorage.setItem('taskflow_jwt', response.accessToken);

      // Redireciona para o dashboard após login bem-sucedido
      router.push('/dashboard'); 

    } catch (err: any) {
      const errorMessage = err.response?.data || 'Erro de conexão ou credenciais inválidas.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-900">Login TaskFlow</h1>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <Input 
            label="Nome de Usuário"
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input 
            label="Senha"
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 font-semibold transition duration-150"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <p className="text-sm text-center text-gray-600">
          Não tem conta? <a href="/auth/register" className="text-blue-600 hover:underline">Cadastre-se</a>
        </p>
      </div>
    </main>
  );
}