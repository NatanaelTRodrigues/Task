// frontend-web/src/app/dashboard/create/page.tsx
'use client';
import React, { useState } from 'react';
import Input from '@/components/Input';
import { createTask } from '@/services/taskService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title) {
      setError('O título é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      await createTask({ title, description });
      alert('Tarefa criada com sucesso!');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar tarefa. Verifique sua sessão.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Criar Nova Tarefa</h1>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>
          )}

          <Input 
            label="Título da Tarefa"
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="mb-4">
              <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (Opcional)
              </label>
              <textarea
                  id="task-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 font-semibold transition duration-150"
          >
            {loading ? 'Salvando...' : 'Criar Tarefa'}
          </button>

          <Link href="/dashboard" className="block text-center mt-4 text-blue-600 hover:underline">
            Voltar para o Dashboard
          </Link>
        </form>
      </div>
    </main>
  );
}