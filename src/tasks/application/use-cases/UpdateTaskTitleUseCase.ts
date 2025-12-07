import { ITaskRepository } from '../../infrastructure/persistence/TaskRepository.interface';

export const UpdateTaskTitleUseCase = async (
  repository: ITaskRepository,
  taskId: string,
  updates: { title?: string }
): Promise<void> => {
  const task = await repository.update(taskId, updates);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
};

