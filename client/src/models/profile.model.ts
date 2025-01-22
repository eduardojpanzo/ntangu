import { TaskModel } from "./task.model";

export class ProfileModel {
  static ENDPOINT = "/profile";
  email?: string;
  id?: number;
  name?: string;
  tasks?: TaskModel[];
}
