import { User } from "./../entities/user";
export interface UserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  addUser(user: User): Promise<User>;
  updateUser(data: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
