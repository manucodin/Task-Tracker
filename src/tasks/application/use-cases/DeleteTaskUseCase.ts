import { ITaskRepository } from '../../infrastructure/persistence/TaskRepository.interface';

export const DeleteTaskUseCase = async (
  repository: ITaskRepository,
  taskId: string
): Promise<void> => {
  const deleted = await repository.delete(taskId);
  if (!deleted) {
    throw new Error(`Task with id ${taskId} not found`);
  }
};

