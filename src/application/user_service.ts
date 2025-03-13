import { UserType } from "../types/user_type";
import { MockUserRepository } from "./mock_user_repository";

export class UserService {
  constructor(private readonly userRepository: MockUserRepository) {
    this.userRepository = userRepository;
  }

  async getUsers(): Promise<UserType[]> {
    const users = await this.userRepository.getUsers();
    return users;
  }

  async getUserById(id: string): Promise<UserType | null> {
    const user = await this.userRepository.getUserById(id);
    if (!user?.id) {
      return null;
    }
    return user;
  }
  async addUser(user: UserType): Promise<void> {
    await this.userRepository.addUser(user);
  }

  async updateUser(user: UserType): Promise<void> {
    await this.userRepository.updateUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
