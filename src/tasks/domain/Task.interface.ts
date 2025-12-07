export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  CANCELLED = 'cancelled',
}

