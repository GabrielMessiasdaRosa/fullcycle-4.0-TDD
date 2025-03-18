import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.getUsers();
    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.getUserById(id);
    return user;
  }
  async addUser({ id, name }: { id: string; name: string }): Promise<void> {
    const newUser = new User(id, name);
    await this.userRepository.addUser(newUser);
  }

  async updateUser(data: { id: string; name: string }): Promise<void> {
    await this.userRepository.updateUser(data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
