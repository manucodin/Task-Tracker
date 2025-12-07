import { Command } from 'commander';
import { listCommand } from '../../../../../src/tasks/infrastructure/cli/commands/list';
import { InMemoryTaskRepository } from '../../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../../src/tasks/domain/Task.interface';

describe('listCommand', () => {
  let repository: InMemoryTaskRepository;
  let consoleLogSpy: jest.SpyInstance;
  let program: Command;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    program = new Command();
    program.addCommand(listCommand(repository));
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should display "No tasks found" when repository is empty', async () => {
    await program.parseAsync(['node', 'test', 'list']);

    expect(consoleLogSpy).toHaveBeenCalledWith('No tasks found');
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });

  it('should display all tasks with correct format', async () => {
    const task1 = await repository.create({
      title: 'Task 1',
      status: TaskStatus.TODO,
    });
    const task2 = await repository.create({
      title: 'Task 2',
      status: TaskStatus.DONE,
    });

    await program.parseAsync(['node', 'test', 'list']);

    expect(consoleLogSpy).toHaveBeenCalledWith('\nTasks:');
    expect(consoleLogSpy).toHaveBeenCalledWith(`  [${task2.status}] ${task2.title} (ID: ${task2.id})`);
    expect(consoleLogSpy).toHaveBeenCalledWith(`  [${task1.status}] ${task1.title} (ID: ${task1.id})`);
  });

  it('should propagate errors', async () => {
    const mockRepository = {
      findAll: jest.fn().mockRejectedValue(new Error('Repository error')),
    } as any;

    const errorProgram = new Command();
    errorProgram.addCommand(listCommand(mockRepository));
    
    await expect(errorProgram.parseAsync(['node', 'test', 'list'])).rejects.toThrow('Repository error');
  });
});
