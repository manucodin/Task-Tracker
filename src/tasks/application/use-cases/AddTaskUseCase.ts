import { ITaskRepository } from '../../infrastructure/persistence/TaskRepository.interface';
import { TaskStatus } from '../../domain/Task.interface';

export const AddTaskUseCase = async (
  repository: ITaskRepository,
  title: string
): Promise<void> => {
  await repository.create({
    title,
    status: TaskStatus.PENDING,
  });
}

