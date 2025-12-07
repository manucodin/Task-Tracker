import { Command } from 'commander';
import { ITaskRepository } from '../../persistence/TaskRepository.interface';
import { UpdateTaskTitleUseCase } from '../../../application/use-cases/UpdateTaskTitleUseCase';

export const updateCommand = (repository: ITaskRepository) => {
  return new Command()
    .command('update')
    .description('Update task title')
    .argument('<taskId>', 'the task ID')
    .argument('<title>', 'the new title')
    .action(async (taskId, title) => {
      try {
        await UpdateTaskTitleUseCase(repository, taskId, { title });
        console.log(`Task title updated successfully`);
      } catch (error) {
        throw error
      }
    });
};

