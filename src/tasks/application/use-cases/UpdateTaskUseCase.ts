import { ITaskRepository } from '../../infrastructure/persistence/TaskRepository.interface';
import { TaskStatus } from '../../domain/Task.interface';

export const UpdateTaskUseCase = async (
  repository: ITaskRepository,
  taskId: string,
  updates: { title?: string; status?: TaskStatus }
): Promise<void> => {
  const task = await repository.update(taskId, updates);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
};

