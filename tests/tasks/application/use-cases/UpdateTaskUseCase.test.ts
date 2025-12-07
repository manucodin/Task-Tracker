import { UpdateTaskTitleUseCase } from '../../../../src/tasks/application/use-cases/UpdateTaskTitleUseCase';
import { InMemoryTaskRepository } from '../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../src/tasks/domain/Task.interface';

describe('UpdateTaskTitleUseCase', () => {
  let repository: InMemoryTaskRepository;
  let taskId: string;

  beforeEach(async () => {
    repository = new InMemoryTaskRepository();
    const task = await repository.create({
      title: 'Original title',
      status: TaskStatus.TODO,
    });
    taskId = task.id;
  });

  it('should update task title', async () => {
    await UpdateTaskTitleUseCase(repository, taskId, { title: 'Updated title' });

    const updatedTask = await repository.findById(taskId);
    expect(updatedTask).not.toBeNull();
    expect(updatedTask?.title).toBe('Updated title');
    expect(updatedTask?.status).toBe(TaskStatus.TODO);
  });


  it('should throw error when task does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(
      UpdateTaskTitleUseCase(repository, nonExistentId, { title: 'New title' })
    ).rejects.toThrow(`Task with id ${nonExistentId} not found`);
  });
});
