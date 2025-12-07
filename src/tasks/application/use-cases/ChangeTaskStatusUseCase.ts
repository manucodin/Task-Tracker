import { TaskStatus } from '../../domain/Task.interface';
import { ITaskRepository } from '../../infrastructure/persistence/TaskRepository.interface';

export const ChangeTaskStatusUseCase = async (
  repository: ITaskRepository,
  taskId: string,
  status: TaskStatus
): Promise<void> => {
  const task = await repository.updateStatus(taskId, status);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
};

