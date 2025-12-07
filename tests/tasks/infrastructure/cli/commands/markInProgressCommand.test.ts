import { Command } from 'commander';
import { markInProgressCommand } from '../../../../../src/tasks/infrastructure/cli/commands/mark-in-progress';
import { InMemoryTaskRepository } from '../../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../../src/tasks/domain/Task.interface';

describe('markInProgressCommand', () => {
  let repository: InMemoryTaskRepository;
  let consoleLogSpy: jest.SpyInstance;
  let program: Command;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    program = new Command();
    program.addCommand(markInProgressCommand(repository));
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should mark task as in progress and display success message', async () => {
    const task = await repository.create({
      title: 'Test task',
      status: TaskStatus.TODO,
    });

    await program.parseAsync(['node', 'test', 'mark-in-progress', task.id]);

    const updatedTask = await repository.findById(task.id);
    expect(updatedTask?.status).toBe(TaskStatus.IN_PROGRESS);
    expect(consoleLogSpy).toHaveBeenCalledWith('Task marked as in progress successfully');
  });

  it('should propagate errors', async () => {
    const mockRepository = {
      updateStatus: jest.fn().mockRejectedValue(new Error('Repository error')),
    } as any;

    const errorProgram = new Command();
    errorProgram.addCommand(markInProgressCommand(mockRepository));
    
    await expect(
      errorProgram.parseAsync(['node', 'test', 'mark-in-progress', 'task-id'])
    ).rejects.toThrow('Repository error');
  });
});
