import { Task, TaskStatus } from '../../domain/Task.interface';

export interface ITaskRepository {
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  findAll(status?: TaskStatus): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null>;
  updateStatus(id: string, status: TaskStatus): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}
