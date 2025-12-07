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

  it('should update task title', async () => {
    const task = await repository.create({
      title: 'Original title',
      status: TaskStatus.TODO,
    });

    await program.parseAsync(['node', 'test', 'update', task.id, 'New title']);

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
      errorProgram.parseAsync(['node', 'test', 'update', 'task-id', 'New title'])
    ).rejects.toThrow('Repository error');
  });
});
