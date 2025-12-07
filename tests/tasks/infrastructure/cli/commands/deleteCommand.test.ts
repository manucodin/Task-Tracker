import { Command } from 'commander';
import { deleteCommand } from '../../../../../src/tasks/infrastructure/cli/commands/delete';
import { InMemoryTaskRepository } from '../../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../../src/tasks/domain/Task.interface';

describe('deleteCommand', () => {
  let repository: InMemoryTaskRepository;
  let consoleLogSpy: jest.SpyInstance;
  let program: Command;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    program = new Command();
    program.addCommand(deleteCommand(repository));
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should delete a task and display success message', async () => {
    const task = await repository.create({
      title: 'Task to delete',
      status: TaskStatus.TODO,
    });

    await program.parseAsync(['node', 'test', 'delete', task.id]);

    const deletedTask = await repository.findById(task.id);
    expect(deletedTask).toBeNull();
    expect(consoleLogSpy).toHaveBeenCalledWith(`Task with ID "${task.id}" deleted successfully`);
  });

  it('should propagate errors', async () => {
    const mockRepository = {
      delete: jest.fn().mockRejectedValue(new Error('Repository error')),
    } as any;

    const errorProgram = new Command();
    errorProgram.addCommand(deleteCommand(mockRepository));
    
    await expect(errorProgram.parseAsync(['node', 'test', 'delete', 'task-id'])).rejects.toThrow('Repository error');
  });
});
