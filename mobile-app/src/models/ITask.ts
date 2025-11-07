// mobile-app/src/models/ITask.ts
export interface ITask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; 
  username: string;
}