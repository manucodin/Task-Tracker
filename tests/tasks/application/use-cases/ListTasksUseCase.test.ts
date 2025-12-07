import { ListTasksUseCase } from '../../../../src/tasks/application/use-cases/ListTasksUseCase';
import { InMemoryTaskRepository } from '../../test-utils/InMemoryTaskRepository';
import { createTask } from '../../test-utils/taskBuilder';
import { TaskStatus } from '../../../../src/tasks/domain/Task.interface';

describe('ListTasksUseCase', () => {
  let repository: InMemoryTaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
  });

  it('should return empty array when no tasks exist', async () => {
    const tasks = await ListTasksUseCase(repository);
    expect(tasks).toEqual([]);
  });

  it('should return all tasks sorted by createdAt descending', async () => {
    await repository.create({ title: 'Task 1', status: TaskStatus.PENDING });
    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));
    await repository.create({ title: 'Task 2', status: TaskStatus.PENDING });
    await new Promise(resolve => setTimeout(resolve, 10));
    await repository.create({ title: 'Task 3', status: TaskStatus.PENDING });

    const tasks = await ListTasksUseCase(repository);

    expect(tasks).toHaveLength(3);
    // Verify tasks are sorted by createdAt descending (newest first)
    expect(tasks[0].createdAt.getTime()).toBeGreaterThanOrEqual(tasks[1].createdAt.getTime());
    expect(tasks[1].createdAt.getTime()).toBeGreaterThanOrEqual(tasks[2].createdAt.getTime());
  });

  it('should return tasks with different statuses', async () => {
    await repository.create({ title: 'Pending task', status: TaskStatus.PENDING });
    await repository.create({ title: 'Completed task', status: TaskStatus.COMPLETED });
    await repository.create({ title: 'In progress task', status: TaskStatus.IN_PROGRESS });

    const tasks = await ListTasksUseCase(repository);

    expect(tasks).toHaveLength(3);
    expect(tasks.some((t) => t.status === TaskStatus.PENDING)).toBe(true);
    expect(tasks.some((t) => t.status === TaskStatus.COMPLETED)).toBe(true);
    expect(tasks.some((t) => t.status === TaskStatus.IN_PROGRESS)).toBe(true);
  });
});
