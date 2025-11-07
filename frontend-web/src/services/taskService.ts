// frontend-web/src/services/taskService.ts
import api from './api';

// Interface (Deve ser criada em models/ITask.ts ou similar, mas manteremos aqui por simplicidade)
interface ITask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  username: string;
}

interface TaskRequest {
    title: string;
    description: string;
}

export const getTasks = async (): Promise<ITask[]> => {
    // Endpoint: GET /api/tasks
    const response = await api.get<ITask[]>('/tasks');
    return response.data;
};

export const createTask = async (data: TaskRequest): Promise<ITask> => {
    // Endpoint: POST /api/tasks
    const response = await api.post<ITask>('/tasks', data);
    return response.data;
};

export const toggleTaskCompletion = async (task: ITask): Promise<ITask> => {
    // Envia o estado invertido para a API
    const updatedData = {
        title: task.title,
        description: task.description || '', // Deve enviar title e description no PUT
        completed: !task.completed // Inverte o status de conclusão
    };
    // Endpoint: PUT /api/tasks/{id}
    const response = await api.put<ITask>(`/tasks/${task.id}`, updatedData);
    return response.data;
};

//Excluir Tarefa (DELETE)
export const deleteTask = async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
};


export type { ITask, TaskRequest };