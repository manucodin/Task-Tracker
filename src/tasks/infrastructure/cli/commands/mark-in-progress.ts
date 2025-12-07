import { Command } from "commander";
import { ITaskRepository } from "../../persistence/TaskRepository.interface";
import { UpdateTaskStatusUseCase } from "@/tasks/application/use-cases/UpdateTaskStatusUseCase";
import { TaskStatus } from "@/tasks/domain/Task.interface";

export const markInProgressCommand = (repository: ITaskRepository) => {
  return new Command()
    .command('mark-in-progress')
    .description('Mark a task as in progress')
    .argument('<taskId>', 'the task ID')
    .action(async (taskId) => {
      try {
        await UpdateTaskStatusUseCase(repository, taskId, TaskStatus.IN_PROGRESS);
        console.log(`Task marked as in progress successfully`);
      } catch (error) {
        throw error
      }
    });
};