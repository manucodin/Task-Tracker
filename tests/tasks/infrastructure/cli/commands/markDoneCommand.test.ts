import { Command } from 'commander';
import { markDoneCommand } from '../../../../../src/tasks/infrastructure/cli/commands/mark-done';
import { InMemoryTaskRepository } from '../../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../../src/tasks/domain/Task.interface';

describe('markDoneCommand', () => {
  let repository: InMemoryTaskRepository;
  let consoleLogSpy: jest.SpyInstance;
  let program: Command;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    program = new Command();
    program.addCommand(markDoneCommand(repository));
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should mark task as done and display success message', async () => {
    const task = await repository.create({
      title: 'Test task',
      status: TaskStatus.TODO,
    });

    await program.parseAsync(['node', 'test', 'mark-done', task.id]);

    const updatedTask = await repository.findById(task.id);
    expect(updatedTask?.status).toBe(TaskStatus.DONE);
    expect(consoleLogSpy).toHaveBeenCalledWith('Task marked as done successfully');
  });

  it('should propagate errors', async () => {
    const mockRepository = {
      updateStatus: jest.fn().mockRejectedValue(new Error('Repository error')),
    } as any;

    const errorProgram = new Command();
    errorProgram.addCommand(markDoneCommand(mockRepository));
    
    await expect(
      errorProgram.parseAsync(['node', 'test', 'mark-done', 'task-id'])
    ).rejects.toThrow('Repository error');
  });
});
