import { CategoryModel } from "./category.model";

export class TaskModel {
  static ENDPOINT = "/tasks";
  id?: number;
  title?: string;
  description?: string | null;
  dueDate?: string;
  duration?: number;
  status?: "backlog" | "todo" | "in-progress" | "done";
  categoryId?: number;
  category?: CategoryModel;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}
