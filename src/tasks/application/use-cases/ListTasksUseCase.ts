import { ITaskRepository } from '../../infrastructure/persistence/TaskRepository.interface';
import { Task, TaskStatus } from '../../domain/Task.interface';

export const ListTasksUseCase = async (repository: ITaskRepository, status?: TaskStatus): Promise<Task[]> => {
  return await repository.findAll(status);
};