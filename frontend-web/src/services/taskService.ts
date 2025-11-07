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

// Exportar a interface para ser usada nas páginas
export type { ITask };