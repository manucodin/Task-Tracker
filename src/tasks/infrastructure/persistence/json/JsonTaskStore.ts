import { promises as fs } from 'fs';
import path from 'path';
import { Task } from '../../../domain/Task.interface';

interface TaskJson {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

const ensureDataDir = async (): Promise<void> => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create data directory: ${error}`);
  }
};

export const readTasks = async (): Promise<Task[]> => {
  try {
    await ensureDataDir();
    const fileContent = await fs.readFile(TASKS_FILE, 'utf-8');
    const tasksJson: TaskJson[] = JSON.parse(fileContent);
    
    return tasksJson.map((taskJson) => ({
      id: taskJson.id,
      title: taskJson.title,
      status: taskJson.status as Task['status'],
      createdAt: new Date(taskJson.createdAt),
      updatedAt: new Date(taskJson.updatedAt),
    }));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw new Error(`Failed to read tasks file: ${error.message}`);
  }
};

export const writeTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await ensureDataDir();
    
    const tasksJson: TaskJson[] = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));
    
    const tempFile = `${TASKS_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(tasksJson, null, 2), 'utf-8');
    await fs.rename(tempFile, TASKS_FILE);
  } catch (error: any) {
    throw new Error(`Failed to write tasks file: ${error.message}`);
  }
};
