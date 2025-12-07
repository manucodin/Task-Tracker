import { UpdateTaskUseCase } from '../../../../src/tasks/application/use-cases/UpdateTaskUseCase';
import { InMemoryTaskRepository } from '../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../src/tasks/domain/Task.interface';

describe('UpdateTaskUseCase', () => {
  let repository: InMemoryTaskRepository;
  let taskId: string;

  beforeEach(async () => {
    repository = new InMemoryTaskRepository();
    const task = await repository.create({
      title: 'Original title',
      status: TaskStatus.PENDING,
    });
    taskId = task.id;
  });

  it('should update task title', async () => {
    await UpdateTaskUseCase(repository, taskId, { title: 'Updated title' });

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.title).toBe('Updated title');
    expect(updatedTask?.status).toBe(TaskStatus.PENDING);
  });

  it('should update task status', async () => {
    await UpdateTaskUseCase(repository, taskId, { status: TaskStatus.COMPLETED });

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.status).toBe(TaskStatus.COMPLETED);
    expect(updatedTask?.title).toBe('Original title');
  });

  it('should update both title and status', async () => {
    await UpdateTaskUseCase(repository, taskId, {
      title: 'New title',
      status: TaskStatus.IN_PROGRESS,
    });

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.title).toBe('New title');
    expect(updatedTask?.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should throw error when task does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(
      UpdateTaskUseCase(repository, nonExistentId, { title: 'New title' })
    ).rejects.toThrow(`Task with id ${nonExistentId} not found`);
  });
});
