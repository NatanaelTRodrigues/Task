// frontend-web/src/app/auth/register/page.tsx
'use client'; 

import React, { useState } from 'react';
import Input from '@/components/Input';
import { registerUser } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      const message = await registerUser({ username, password });
      
      setSuccessMessage(message || 'Usuário registrado com sucesso! Redirecionando...');
      
      // Redireciona para o login após 2 segundos
      setTimeout(() => {
        router.push('/auth/login'); 
      }, 2000);

    } catch (err: any) {
      const apiError = err.response?.data || 'Erro de conexão ou nome de usuário inválido.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-900">Criar Conta TaskFlow</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Mensagens de feedback */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
              {successMessage}
            </div>
          )}

          <Input 
            label="Nome de Usuário"
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input 
            label="Senha"
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 font-semibold transition duration-150"
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        
        <p className="text-sm text-center text-gray-600">
          Já tem conta? <a href="/auth/login" className="text-blue-600 hover:underline">Faça Login</a>
        </p>
      </div>
    </main>
  );
}