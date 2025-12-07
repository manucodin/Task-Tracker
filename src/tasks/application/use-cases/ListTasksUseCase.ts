import { ITaskRepository } from '../../infrastructure/persistence/TaskRepository.interface';
import { Task } from '../../domain/Task.interface';

export const ListTasksUseCase = async (repository: ITaskRepository): Promise<Task[]> => {
  return await repository.findAll();
};

