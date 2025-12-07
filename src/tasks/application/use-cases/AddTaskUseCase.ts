import { ITaskRepository } from '../../infrastructure/persistence/TaskRepository.interface';
import { TaskStatus, Task } from '../../domain/Task.interface';

export const AddTaskUseCase = async (
  repository: ITaskRepository,
  title: string
): Promise<Task> => {
  return await repository.create({
    title,
    status: TaskStatus.TODO,
  });
}

