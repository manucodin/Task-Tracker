export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'todo',
  DONE = 'done',
  IN_PROGRESS = 'in-progress'
}

