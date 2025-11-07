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
// Toggle Completion (PUT)
export const toggleTaskCompletion = async (task: ITask): Promise<ITask> => {
    const updatedData = {
        title: task.title,
        description: task.description || '',
        completed: !task.completed // Inverte o status
    };
    // Endpoint: PUT /api/tasks/{id}
    const response = await api.put<ITask>(`/tasks/${task.id}`, updatedData);
    return response.data;
};

//Excluir Tarefa (DELETE)
export const deleteTask = async (taskId: number): Promise<void> => {
    // Endpoint: DELETE /api/tasks/{id}
    await api.delete(`/tasks/${taskId}`);
};