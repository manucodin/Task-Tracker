import { UpdateTaskStatusUseCase } from '../../../../src/tasks/application/use-cases/UpdateTaskStatusUseCase';
import { InMemoryTaskRepository } from '../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../src/tasks/domain/Task.interface';

describe('UpdateTaskStatusUseCase', () => {
  let repository: InMemoryTaskRepository;
  let taskId: string;

  beforeEach(async () => {
    repository = new InMemoryTaskRepository();
    const task = await repository.create({
      title: 'Test task',
      status: TaskStatus.TODO,
    });
    taskId = task.id;
  });

  it('should update task status to DONE', async () => {
    await UpdateTaskStatusUseCase(repository, taskId, TaskStatus.DONE);

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.status).toBe(TaskStatus.DONE);
  });

  it('should update task status to IN_PROGRESS', async () => {
    await UpdateTaskStatusUseCase(repository, taskId, TaskStatus.IN_PROGRESS);

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should update task status to TODO', async () => {
    await repository.updateStatus(taskId, TaskStatus.DONE);
    await UpdateTaskStatusUseCase(repository, taskId, TaskStatus.TODO);

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.status).toBe(TaskStatus.TODO);
  });

  it('should throw error when task does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(
      UpdateTaskStatusUseCase(repository, nonExistentId, TaskStatus.DONE)
    ).rejects.toThrow(`Task with id ${nonExistentId} not found`);
  });
});
