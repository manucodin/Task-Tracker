import { Command } from 'commander';
import { ITaskRepository } from '../../persistence/TaskRepository.interface';
import { UpdateTaskUseCase } from '../../../application/use-cases/UpdateTaskUseCase';
import { ChangeTaskStatusUseCase } from '../../../application/use-cases/ChangeTaskStatusUseCase';
import { TaskStatus } from '../../../domain/Task.interface';

export const updateCommand = (repository: ITaskRepository) => {
  const command = new Command()
    .command('update')
    .description('Update a task');

  command
    .command('status')
    .description('Change task status')
    .argument('<taskId>', 'the task ID')
    .argument('<status>', 'the new status (pending, in_progress, completed, cancelled)')
    .action(async (taskId, status) => {
      try {
        const taskStatus = status as TaskStatus;
        if (!Object.values(TaskStatus).includes(taskStatus)) {
          console.error(`Invalid status. Valid values: ${Object.values(TaskStatus).join(', ')}`);
          process.exit(1);
          return;
        }
        await ChangeTaskStatusUseCase(repository, taskId, taskStatus);
        console.log(`Task status updated successfully`);
      } catch (error) {
        console.error('Error updating task status:', error);
        process.exit(1);
      }
    });

  command
    .command('title')
    .description('Update task title')
    .argument('<taskId>', 'the task ID')
    .argument('<title>', 'the new title')
    .action(async (taskId, title) => {
      try {
        await UpdateTaskUseCase(repository, taskId, { title });
        console.log(`Task title updated successfully`);
      } catch (error) {
        console.error('Error updating task title:', error);
        process.exit(1);
      }
    });

  return command;
};

