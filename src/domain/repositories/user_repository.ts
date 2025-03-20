import { User } from "./../entities/user";
export interface UserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  addUser(user: User): Promise<User>;
  updateUser(data: { id: string; name: string }): Promise<User>;
  deleteUser(id: string): Promise<User>;
}
