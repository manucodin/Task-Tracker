import { DeleteTaskUseCase } from '../../../../src/tasks/application/use-cases/DeleteTaskUseCase';
import { InMemoryTaskRepository } from '../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../src/tasks/domain/Task.interface';

describe('DeleteTaskUseCase', () => {
  let repository: InMemoryTaskRepository;
  let taskId: string;

  beforeEach(async () => {
    repository = new InMemoryTaskRepository();
    const task = await repository.create({
      title: 'Task to delete',
      status: TaskStatus.PENDING,
    });
    taskId = task.id;
  });

  it('should delete an existing task', async () => {
    await DeleteTaskUseCase(repository, taskId);

    const deletedTask = await repository.findById(taskId);
    expect(deletedTask).toBeNull();
    expect(repository.getTasks()).toHaveLength(0);
  });

  it('should throw error when task does not exist', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(DeleteTaskUseCase(repository, nonExistentId)).rejects.toThrow(
      `Task with id ${nonExistentId} not found`
    );
  });

  it('should delete correct task when multiple tasks exist', async () => {
    const task2 = await repository.create({
      title: 'Task 2',
      status: TaskStatus.PENDING,
    });
    const task3 = await repository.create({
      title: 'Task 3',
      status: TaskStatus.PENDING,
    });

    await DeleteTaskUseCase(repository, task2.id);

    expect(repository.getTasks()).toHaveLength(2);
    expect(await repository.findById(taskId)).not.toBeNull();
    expect(await repository.findById(task2.id)).toBeNull();
    expect(await repository.findById(task3.id)).not.toBeNull();
  });
});
