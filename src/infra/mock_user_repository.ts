import { User } from "../domain/entities/user";
import { UserRepository } from "../domain/repositories/user_repository";

export class MockUserRepository implements UserRepository {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    if (!user?.id) {
      return null;
    }
    return user;
  }

  async addUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async updateUser(data: { id: string; name: string }): Promise<User> {
    this.users.forEach((user) => {
      if (user.id === data.id) {
        user.name = data.name;
      }
    });
    return this.users.find((user) => user.id === data.id) as User;
  }

  async deleteUser(id: string): Promise<User> {
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.find((user) => user.id === id) as User;
  }
}
