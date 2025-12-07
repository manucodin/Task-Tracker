import { AddTaskUseCase } from '../../../../src/tasks/application/use-cases/AddTaskUseCase';
import { InMemoryTaskRepository } from '../../test-utils/InMemoryTaskRepository';
import { TaskStatus } from '../../../../src/tasks/domain/Task.interface';

describe('AddTaskUseCase', () => {
  let repository: InMemoryTaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
  });

  it('should create a task with PENDING status', async () => {
    const title = 'Test task';
    
    await AddTaskUseCase(repository, title);

    const tasks = repository.getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe(title);
    expect(tasks[0].status).toBe(TaskStatus.PENDING);
    expect(tasks[0]).toHaveProperty('id');
    expect(tasks[0]).toHaveProperty('createdAt');
    expect(tasks[0]).toHaveProperty('updatedAt');
  });

  it('should add multiple tasks', async () => {
    await AddTaskUseCase(repository, 'Task 1');
    await AddTaskUseCase(repository, 'Task 2');
    await AddTaskUseCase(repository, 'Task 3');

    const tasks = repository.getTasks();
    expect(tasks).toHaveLength(3);
    expect(tasks[0].title).toBe('Task 1');
    expect(tasks[1].title).toBe('Task 2');
    expect(tasks[2].title).toBe('Task 3');
  });
});
