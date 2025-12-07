import { ITaskRepository } from '../TaskRepository.interface';
import { Task, TaskStatus } from '../../../domain/Task.interface';
import { readTasks, writeTasks } from './JsonTaskStore';
import { randomUUID } from 'crypto';

export class JsonTaskRepository implements ITaskRepository {
  async create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const tasks = await readTasks();
    const now = new Date();
    
    const newTask: Task = {
      id: randomUUID(),
      title: task.title,
      status: task.status,
      createdAt: now,
      updatedAt: now,
    };
    
    tasks.push(newTask);
    await writeTasks(tasks);
    
    return newTask;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await readTasks();
    // Sort by createdAt descending (newest first) to match MongoDB behavior
    return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Task | null> {
    const tasks = await readTasks();
    return tasks.find((task) => task.id === id) || null;
  }

  async update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }
    
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    tasks[taskIndex] = updatedTask;
    await writeTasks(tasks);
    
    return updatedTask;
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return this.update(id, { status });
  }

  async delete(id: string): Promise<boolean> {
    const tasks = await readTasks();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter((task) => task.id !== id);
    
    if (filteredTasks.length === initialLength) {
      return false;
    }
    
    await writeTasks(filteredTasks);
    return true;
  }
}
