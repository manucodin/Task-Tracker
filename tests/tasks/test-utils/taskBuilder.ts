import { Task, TaskStatus } from '../../../src/tasks/domain/Task.interface';
import { randomUUID } from 'crypto';

export const createTask = (overrides?: Partial<Task>): Task => {
  const now = new Date();
  return {
    id: randomUUID(),
    title: 'Test Task',
    status: TaskStatus.PENDING,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};
