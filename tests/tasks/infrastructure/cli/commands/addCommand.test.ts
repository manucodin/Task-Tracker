import { Command } from 'commander';
import { addCommand } from '../../../../../src/tasks/infrastructure/cli/commands/add';
import { InMemoryTaskRepository } from '../../../test-utils/InMemoryTaskRepository';

describe('addCommand', () => {
  let repository: InMemoryTaskRepository;
  let consoleLogSpy: jest.SpyInstance;
  let program: Command;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    program = new Command();
    program.addCommand(addCommand(repository));
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should add a task and display success message', async () => {
    const taskTitle = 'Test task';
    
    await program.parseAsync(['node', 'test', 'add', taskTitle]);

    const tasks = repository.getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe(taskTitle);
    expect(consoleLogSpy).toHaveBeenCalledWith(`Task "${taskTitle}" added successfully`);
  });

  it('should propagate errors', async () => {
    const mockRepository = {
      create: jest.fn().mockRejectedValue(new Error('Repository error')),
    } as any;

    const errorProgram = new Command();
    errorProgram.addCommand(addCommand(mockRepository));
    
    await expect(errorProgram.parseAsync(['node', 'test', 'add', 'Task'])).rejects.toThrow('Repository error');
  });
});
