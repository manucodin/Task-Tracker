import { ITaskRepository } from '../../../src/tasks/infrastructure/persistence/TaskRepository.interface';
import { Task, TaskStatus } from '../../../src/tasks/domain/Task.interface';
import { randomUUID } from 'crypto';

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Task[] = [];

  async create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date();
    const newTask: Task = {
      id: randomUUID(),
      title: task.title,
      status: task.status,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async findAll(): Promise<Task[]> {
    return [...this.tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find((task) => task.id === id) || null;
  }

  async update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return null;
    }
    const updatedTask: Task = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };
    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks.length < initialLength;
  }

  // Helper methods for testing
  clear(): void {
    this.tasks = [];
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }
}
