// TaskMapper is not currently used after migrating from MongoDB to JSON
// This file is kept for potential future use if other persistence implementations require mapping
// import { Task, TaskStatus } from '../../domain/Task.interface';
// import { TaskDocument } from '../persistence/mongo/Task.model';

// export class TaskMapper {
//   static toDomain(taskDocument: TaskDocument): Task {
//     return {
//       id: taskDocument._id.toString(),
//       title: taskDocument.title,
//       status: taskDocument.status as TaskStatus,
//       createdAt: taskDocument.createdAt,
//       updatedAt: taskDocument.updatedAt,
//     };
//   }
// }

