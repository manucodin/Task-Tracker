import { TaskStatus } from "@/tasks/domain/Task.interface";
import { ITaskRepository } from "@/tasks/infrastructure/persistence/TaskRepository.interface";

export const UpdateTaskStatusUseCase = async (repository: ITaskRepository, taskId: string, status: TaskStatus): Promise<void> => {
  const task = await repository.updateStatus(taskId, status);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
};