// frontend-web/src/app/dashboard/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { getTasks, ITask } from '@/services/taskService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err: any) {
      // Se falhar (ex: 401 Unauthorized), redireciona para o login
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('taskflow_jwt');
        router.push('/auth/login');
      } else {
        setError('Erro ao carregar tarefas. Verifique se o Backend Java está online.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('taskflow_jwt');
      router.push('/auth/login');
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
        <button onClick={handleLogout} className="text-red-600 hover:underline">Sair</button>
      </div>

      <Link href="/dashboard/create" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 inline-block mb-6">
        + Nova Tarefa
      </Link>

      {loading && <p className="text-center text-gray-500">Carregando tarefas...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 && !loading && !error ? (
            <p className="col-span-3 text-center text-gray-600">Nenhuma tarefa encontrada. Crie sua primeira!</p>
        ) : (
            tasks.map(task => (
                <div key={task.id} className={`p-5 rounded-lg shadow-md ${task.completed ? 'bg-green-100' : 'bg-white'}`}>
                    <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                    <p className="text-gray-600 mb-4">{task.description}</p>
                    <span className={`text-sm font-medium ${task.completed ? 'text-green-700' : 'text-orange-600'}`}>
                        Status: {task.completed ? 'Concluída' : 'Pendente'}
                    </span>
                    {/* Ações de Update/Delete viriam aqui */}
                </div>
            ))
        )}
      </div>
    </main>
  );
}