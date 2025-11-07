// frontend-web/src/app/dashboard/page.tsx (ATUALIZADO)
'use client';
import React, { useState, useEffect } from 'react';
import { getTasks, ITask, toggleTaskCompletion, deleteTask } from '@/services/taskService'; // NOVOS IMPORTS
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Função para buscar tarefas (reutilizada)
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err: any) {
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

  // NOVO: Função para alternar status (PUT)
  const handleToggle = async (task: ITask) => {
      try {
          const updatedTask = await toggleTaskCompletion(task);
          // Atualiza o estado local para refletir a mudança
          setTasks(prevTasks => 
              prevTasks.map(t => (t.id === updatedTask.id ? updatedTask : t))
          );
      } catch (error) {
          alert('Falha ao atualizar a tarefa.');
          console.error(error);
      }
  };

  // NOVO: Função para deletar (DELETE)
  const handleDelete = async (taskId: number) => {
      if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
          return;
      }
      try {
          await deleteTask(taskId);
          // Remove do estado local
          setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
          alert('Tarefa excluída com sucesso!');
      } catch (error) {
          alert('Falha ao excluir a tarefa.');
          console.error(error);
      }
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
                <div key={task.id} className={`p-5 rounded-lg shadow-md ${task.completed ? 'bg-green-100 border-l-4 border-green-500' : 'bg-white border-l-4 border-orange-500'}`}>
                    <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                    <p className="text-gray-600 mb-4">{task.description}</p>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <span className={`text-sm font-medium ${task.completed ? 'text-green-700' : 'text-orange-600'}`}>
                            Status: {task.completed ? 'Concluída' : 'Pendente'}
                        </span>

                        <div className="space-x-2">
                            {/* Botão de Conclusão/Reabertura */}
                            <button 
                                onClick={() => handleToggle(task)}
                                className={`py-1 px-3 text-sm rounded ${task.completed ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white transition duration-150`}
                            >
                                {task.completed ? 'Reabrir' : 'Concluir'}
                            </button>

                            {/* Botão de Excluir */}
                            <button 
                                onClick={() => handleDelete(task.id)}
                                className="py-1 px-3 text-sm rounded bg-red-500 hover:bg-red-600 text-white transition duration-150"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </main>
  );
}