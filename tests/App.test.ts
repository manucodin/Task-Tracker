import { Command } from 'commander';
import { addCommand } from '../src/tasks/infrastructure/cli/commands/add';
import { deleteCommand } from '../src/tasks/infrastructure/cli/commands/delete';
import { listCommand } from '../src/tasks/infrastructure/cli/commands/list';
import { updateCommand } from '../src/tasks/infrastructure/cli/commands/update';
import { InMemoryTaskRepository } from './tasks/test-utils/InMemoryTaskRepository';

const createProgram = (repository: any): Command => {
  const program = new Command();

  program
    .name('task-tracker')
    .description('Task Tracker CLI')
    .version('1.0.0')
    .addCommand(listCommand(repository), { isDefault: true })
    .addCommand(addCommand(repository))
    .addCommand(deleteCommand(repository))
    .addCommand(updateCommand(repository));

  return program;
};

describe('App', () => {
  describe('createProgram', () => {
    it('should create a program with correct name and description', () => {
      const repository = new InMemoryTaskRepository();
      const program = createProgram(repository);

      expect(program.name()).toBe('task-tracker');
      expect(program.description()).toBe('Task Tracker CLI');
    });

    it('should register all commands', () => {
      const repository = new InMemoryTaskRepository();
      const program = createProgram(repository);

      const commandNames = program.commands.map((cmd: Command) => cmd.name());
      expect(commandNames).toContain('list');
      expect(commandNames).toContain('add');
      expect(commandNames).toContain('delete');
      expect(commandNames).toContain('update');
    });

    it('should set list as default command', () => {
      const repository = new InMemoryTaskRepository();
      const program = createProgram(repository);

      const listCommand = program.commands.find((cmd: Command) => cmd.name() === 'list');
      expect(listCommand).toBeDefined();
    });

    it('should register update subcommands', () => {
      const repository = new InMemoryTaskRepository();
      const program = createProgram(repository);

      const updateCommand = program.commands.find((cmd: Command) => cmd.name() === 'update');
      expect(updateCommand).toBeDefined();
      
      const updateSubcommands = updateCommand?.commands.map((cmd: Command) => cmd.name()) || [];
      expect(updateSubcommands).toContain('status');
      expect(updateSubcommands).toContain('title');
    });
  });
});
