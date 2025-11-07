// mobile-app/src/services/taskService.ts
import api from '@/api';
import { ITask } from '@/models/ITask';

interface TaskRequest {
    title: string;
    description: string;
}

export const getTasks = async (): Promise<ITask[]> => {
    // NOTE: O endpoint GET /api/tasks buscará as tarefas do usuário logado
    const response = await api.get<ITask[]>('/tasks');
    return response.data;
};

export const createTask = async (data: TaskRequest): Promise<ITask> => {
    // Endpoint POST /api/tasks
    const response = await api.post<ITask>('/tasks', data);
    return response.data;
};