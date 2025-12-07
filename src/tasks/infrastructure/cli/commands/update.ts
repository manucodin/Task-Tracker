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
          throw new Error(`Invalid status. Valid values: ${Object.values(TaskStatus).join(', ')}`);
        }
        await ChangeTaskStatusUseCase(repository, taskId, taskStatus);
        console.log(`Task status updated successfully`);
      } catch (error) {
        throw new Error('Error updating task status');
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
        throw error
      }
    });

  return command;
};

