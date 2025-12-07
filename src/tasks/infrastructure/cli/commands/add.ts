import { Command } from 'commander';
import { ITaskRepository } from '../../persistence/TaskRepository.interface';
import { AddTaskUseCase } from '../../../application/use-cases/AddTaskUseCase';

export const addCommand = (repository: ITaskRepository) => {
  return new Command()
    .command('add')
    .description('Add a new task')
    .argument('<task>', 'the task to add')
    .action(async (task) => {
      try {
        await AddTaskUseCase(repository, task);
        console.log(`Task "${task}" added successfully`);
      } catch (error) {
        console.error('Error adding task:', error);
        process.exit(1);
      }
    });
};

