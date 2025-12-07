import { JsonTaskRepository } from '../../../../../src/tasks/infrastructure/persistence/json/JsonTaskRepository';
import { TaskStatus } from '../../../../../src/tasks/domain/Task.interface';
import * as fs from 'fs/promises';
import path from 'path';

// Mock the JsonTaskStore module
jest.mock('../../../../../src/tasks/infrastructure/persistence/json/JsonTaskStore', () => ({
  readTasks: jest.fn(),
  writeTasks: jest.fn(),
}));

describe('JsonTaskRepository', () => {
  let repository: JsonTaskRepository;
  const { readTasks, writeTasks } = require('../../../../../src/tasks/infrastructure/persistence/json/JsonTaskStore');

  beforeEach(() => {
    repository = new JsonTaskRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task with generated id and timestamps', async () => {
      readTasks.mockResolvedValue([]);

      const newTask = await repository.create({
        title: 'Test task',
        status: TaskStatus.TODO,
      });

      expect(newTask).toHaveProperty('id');
      expect(newTask.id).toBeTruthy();
      expect(newTask.title).toBe('Test task');
      expect(newTask.status).toBe(TaskStatus.TODO);
      expect(newTask.createdAt).toBeInstanceOf(Date);
      expect(newTask.updatedAt).toBeInstanceOf(Date);
      expect(newTask.createdAt.getTime()).toBe(newTask.updatedAt.getTime());
      expect(writeTasks).toHaveBeenCalledTimes(1);
    });

    it('should add task to existing tasks array', async () => {
      const existingTasks = [
        {
          id: '1',
          title: 'Existing task',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      readTasks.mockResolvedValue(existingTasks);

      const newTask = await repository.create({
        title: 'New task',
        status: TaskStatus.TODO,
      });

      expect(writeTasks).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: '1', title: 'Existing task' }),
          expect.objectContaining({ id: newTask.id, title: 'New task' }),
        ])
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks sorted by createdAt descending', async () => {
      const tasks = [
        {
          id: '1',
          title: 'First task',
          status: TaskStatus.TODO,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          title: 'Second task',
          status: TaskStatus.DONE,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
      ];

      readTasks.mockResolvedValue(tasks);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('1');
    });
  });

  describe('findById', () => {
    it('should return a task by id', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Test task',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      readTasks.mockResolvedValue(tasks);

      const result = await repository.findById('1');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
      expect(result?.title).toBe('Test task');
    });

    it('should return null if task not found', async () => {
      readTasks.mockResolvedValue([]);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a task title', async () => {
      const originalDate = new Date('2024-01-01');
      const tasks = [
        {
          id: '1',
          title: 'Original title',
          status: TaskStatus.TODO,
          createdAt: originalDate,
          updatedAt: originalDate,
        },
      ];

      readTasks.mockResolvedValue(tasks);

      const result = await repository.update('1', { title: 'Updated title' });

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Updated title');
      expect(result?.status).toBe(TaskStatus.TODO);
      expect(result?.updatedAt.getTime()).toBeGreaterThanOrEqual(originalDate.getTime());
      expect(writeTasks).toHaveBeenCalledTimes(1);
    });

    it('should update task status', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Test task',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      readTasks.mockResolvedValue(tasks);

      const result = await repository.update('1', { status: TaskStatus.DONE });

      expect(result).not.toBeNull();
      expect(result?.status).toBe(TaskStatus.DONE);
      expect(result?.title).toBe('Test task');
      expect(writeTasks).toHaveBeenCalledTimes(1);
    });

    it('should update both title and status', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Original title',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      readTasks.mockResolvedValue(tasks);

      const result = await repository.update('1', {
        title: 'New title',
        status: TaskStatus.IN_PROGRESS,
      });

      expect(result).not.toBeNull();
      expect(result?.title).toBe('New title');
      expect(result?.status).toBe(TaskStatus.IN_PROGRESS);
      expect(writeTasks).toHaveBeenCalledTimes(1);
    });

    it('should return null if task not found', async () => {
      readTasks.mockResolvedValue([]);

      const result = await repository.update('non-existent', { title: 'New title' });

      expect(result).toBeNull();
      expect(writeTasks).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Test task',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      readTasks.mockResolvedValue(tasks);

      const result = await repository.updateStatus('1', TaskStatus.DONE);

      expect(result).not.toBeNull();
      expect(result?.status).toBe(TaskStatus.DONE);
      expect(result?.title).toBe('Test task');
      expect(writeTasks).toHaveBeenCalledTimes(1);
    });

    it('should return null if task not found', async () => {
      readTasks.mockResolvedValue([]);

      const result = await repository.updateStatus('non-existent', TaskStatus.DONE);

      expect(result).toBeNull();
      expect(writeTasks).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Test task',
          status: TaskStatus.TODO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      readTasks.mockResolvedValue(tasks);

      const result = await repository.delete('1');

      expect(result).toBe(true);
      expect(writeTasks).toHaveBeenCalledTimes(1);
    });

    it('should return false if task not found', async () => {
      readTasks.mockResolvedValue([]);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
      expect(writeTasks).not.toHaveBeenCalled();
    });
  });
});
