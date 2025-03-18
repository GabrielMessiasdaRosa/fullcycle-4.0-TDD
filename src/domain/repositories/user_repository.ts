import { User } from "./../entities/user";
export interface UserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  addUser(user: User): Promise<void>;
  updateUser(data: { id: string; name: string }): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
