import { Command } from 'commander';
import { JsonTaskRepository } from './tasks/infrastructure/persistence/json/JsonTaskRepository';
import { addCommand } from './tasks/infrastructure/cli/commands/add';
import { deleteCommand } from './tasks/infrastructure/cli/commands/delete';
import { listCommand } from './tasks/infrastructure/cli/commands/list';
import { updateCommand } from './tasks/infrastructure/cli/commands/update';

const program = new Command();

const repository = new JsonTaskRepository();

program
  .name('task-tracker')
  .description('Task Tracker CLI')
  .version('1.0.0')
  .addCommand(listCommand(repository), { isDefault: true })
  .addCommand(addCommand(repository))
  .addCommand(deleteCommand(repository))
  .addCommand(updateCommand(repository));

const main = async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

main();
