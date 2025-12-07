import { Command } from 'commander';
import { ITaskRepository } from '../../persistence/TaskRepository.interface';
import { DeleteTaskUseCase } from '../../../application/use-cases/DeleteTaskUseCase';

export const deleteCommand = (repository: ITaskRepository) => {
  return new Command()
    .command('delete')
    .description('Delete a task')
    .argument('<taskId>', 'the task ID to delete')
    .action(async (taskId) => {
      try {
        await DeleteTaskUseCase(repository, taskId);
        console.log(`Task with ID "${taskId}" deleted successfully`);
      } catch (error) {
        throw error
      }
    });
};

