import { Command } from 'commander';
import { ITaskRepository } from '../../persistence/TaskRepository.interface';
import { ListTasksUseCase } from '../../../application/use-cases/ListTasksUseCase';

export const listCommand = (repository: ITaskRepository) => {
  return new Command()
    .command('list')
    .description('List all tasks')
    .argument('[status]', 'the status of the tasks to list', undefined)
    .action(async (status) => {
      try {
        const tasks = await ListTasksUseCase(repository, status);
        if (tasks.length === 0) {
          console.log('No tasks found');
          return;
        }
        console.log('\nTasks:');
        tasks.forEach((task) => {
          console.log(`  [${task.status}] ${task.title} (ID: ${task.id})`);
        });
      } catch (error) {
        throw error
      }
    });
};

