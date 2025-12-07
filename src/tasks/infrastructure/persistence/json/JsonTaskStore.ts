import { promises as fs } from 'fs';
import path from 'path';
import { Task } from '../../../domain/Task.interface';

// Task representation in JSON file (dates as ISO strings)
interface TaskJson {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists
const ensureDataDir = async (): Promise<void> => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create data directory: ${error}`);
  }
};

// Read tasks from JSON file
export const readTasks = async (): Promise<Task[]> => {
  try {
    await ensureDataDir();
    const fileContent = await fs.readFile(TASKS_FILE, 'utf-8');
    const tasksJson: TaskJson[] = JSON.parse(fileContent);
    
    // Convert ISO date strings back to Date objects
    return tasksJson.map((taskJson) => ({
      id: taskJson.id,
      title: taskJson.title,
      status: taskJson.status as Task['status'],
      createdAt: new Date(taskJson.createdAt),
      updatedAt: new Date(taskJson.updatedAt),
    }));
  } catch (error: any) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw new Error(`Failed to read tasks file: ${error.message}`);
  }
};

// Write tasks to JSON file atomically
export const writeTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await ensureDataDir();
    
    // Convert Date objects to ISO strings for JSON serialization
    const tasksJson: TaskJson[] = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));
    
    // Write to temporary file first, then rename (atomic operation)
    const tempFile = `${TASKS_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(tasksJson, null, 2), 'utf-8');
    await fs.rename(tempFile, TASKS_FILE);
  } catch (error: any) {
    throw new Error(`Failed to write tasks file: ${error.message}`);
  }
};
