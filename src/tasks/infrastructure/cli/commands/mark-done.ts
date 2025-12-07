import { Command } from "commander";
import { ITaskRepository } from "../../persistence/TaskRepository.interface";
import { UpdateTaskStatusUseCase } from "@/tasks/application/use-cases/UpdateTaskStatusUseCase";
import { TaskStatus } from "@/tasks/domain/Task.interface";

export const markDoneCommand = (repository: ITaskRepository) => {
  return new Command()
    .command('mark-done')
    .description('Mark a task as done')
    .argument('<taskId>', 'the task ID')
    .action(async (taskId) => {
      try {
        await UpdateTaskStatusUseCase(repository, taskId, TaskStatus.DONE);
        console.log(`Task marked as done successfully`);
      } catch (error) {
        throw error
      }
    });
};