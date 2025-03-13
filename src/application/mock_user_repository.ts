import { User } from "../domain/entities/user";
import { UserType } from "../types/user_type";

export class MockUserRepository {
  private users: UserType[] = [];

  async getUsers(): Promise<UserType[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<UserType | null> {
    const user = this.users.find((user) => user.id === id);
    if (!user?.id) {
      return null;
    }
    return user;
  }

  async addUser(user: UserType): Promise<void> {
    const newUser = new User(user.id, user.name) as UserType;
    this.users.push(newUser);
  }

  async updateUser(user: UserType): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    this.users[index] = user;
  }

  async deleteUser(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
