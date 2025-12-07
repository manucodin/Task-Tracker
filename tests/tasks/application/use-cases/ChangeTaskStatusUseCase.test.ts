import { ChangeTaskStatusUseCase } from '../../../../src/tasks/application/use-cases/ChangeTaskStatusUseCase';
import { InMemoryTaskRepository } from '../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../src/tasks/domain/Task.interface';

describe('ChangeTaskStatusUseCase', () => {
  let repository: InMemoryTaskRepository;
  let taskId: string;

  beforeEach(async () => {
    repository = new InMemoryTaskRepository();
    const task = await repository.create({
      title: 'Test task',
      status: TaskStatus.PENDING,
    });
    taskId = task.id;
  });

  it('should change task status to COMPLETED', async () => {
    await ChangeTaskStatusUseCase(repository, taskId, TaskStatus.COMPLETED);

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.status).toBe(TaskStatus.COMPLETED);
  });

  it('should change task status to IN_PROGRESS', async () => {
    await ChangeTaskStatusUseCase(repository, taskId, TaskStatus.IN_PROGRESS);

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should change task status to CANCELLED', async () => {
    await ChangeTaskStatusUseCase(repository, taskId, TaskStatus.CANCELLED);

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.status).toBe(TaskStatus.CANCELLED);
  });

  it('should throw error when task does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(
      ChangeTaskStatusUseCase(repository, nonExistentId, TaskStatus.COMPLETED)
    ).rejects.toThrow(`Task with id ${nonExistentId} not found`);
  });
});
