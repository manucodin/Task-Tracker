import { Command } from 'commander';
import { updateCommand } from '../../../../../src/tasks/infrastructure/cli/commands/update';
import { InMemoryTaskRepository } from '../../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../../src/tasks/domain/Task.interface';

describe('updateCommand', () => {
  let repository: InMemoryTaskRepository;
  let consoleLogSpy: jest.SpyInstance;
  let program: Command;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    program = new Command();
    program.addCommand(updateCommand(repository));
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('status subcommand', () => {
    it('should update task status with valid status', async () => {
      const task = await repository.create({
        title: 'Test task',
        status: TaskStatus.PENDING,
      });

      await program.parseAsync(['node', 'test', 'update', 'status', task.id, TaskStatus.COMPLETED]);

      const updatedTask = await repository.findById(task.id);
      expect(updatedTask?.status).toBe(TaskStatus.COMPLETED);
      expect(consoleLogSpy).toHaveBeenCalledWith('Task status updated successfully');
    });

    it('should throw error with invalid status', async () => {
      const task = await repository.create({
        title: 'Test task',
        status: TaskStatus.PENDING,
      });

      await expect(
        program.parseAsync(['node', 'test', 'update', 'status', task.id, 'invalid_status'])
      ).rejects.toThrow('Error updating task status');
    });

    it('should propagate errors', async () => {
      const mockRepository = {
        updateStatus: jest.fn().mockRejectedValue(new Error('Repository error')),
      } as any;

      const errorProgram = new Command();
      errorProgram.addCommand(updateCommand(mockRepository));
      
      await expect(
        errorProgram.parseAsync(['node', 'test', 'update', 'status', 'task-id', TaskStatus.COMPLETED])
      ).rejects.toThrow('Error updating task status');
    });
  });

  describe('title subcommand', () => {
    it('should update task title', async () => {
      const task = await repository.create({
        title: 'Original title',
        status: TaskStatus.PENDING,
      });

      await program.parseAsync(['node', 'test', 'update', 'title', task.id, 'New title']);

      const updatedTask = await repository.findById(task.id);
      expect(updatedTask?.title).toBe('New title');
      expect(consoleLogSpy).toHaveBeenCalledWith('Task title updated successfully');
    });

    it('should propagate errors', async () => {
      const mockRepository = {
        update: jest.fn().mockRejectedValue(new Error('Repository error')),
      } as any;

      const errorProgram = new Command();
      errorProgram.addCommand(updateCommand(mockRepository));
      
      await expect(
        errorProgram.parseAsync(['node', 'test', 'update', 'title', 'task-id', 'New title'])
      ).rejects.toThrow('Repository error');
    });
  });
});
