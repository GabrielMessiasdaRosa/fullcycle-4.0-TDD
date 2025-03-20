import { v4 as uuidv4 } from "uuid";
import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { CreateUserDTO } from "../dtos/user/create_user_dto";
import { DeleteUserDTO } from "../dtos/user/delete_user_dto";
import { UpdateUserDTO } from "../dtos/user/update_user_dto";
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
  async addUser(payload: CreateUserDTO): Promise<User> {
    const id = uuidv4();
    const newUser = new User(id, payload.name);
    await this.userRepository.addUser(newUser);
    return newUser;
  }

  async updateUser(data: UpdateUserDTO): Promise<User> {
    const user = await this.getUserById(data.id);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const newUser = new User(data.id, data.name);
    await this.userRepository.updateUser(newUser);
    return newUser;
  }

  async deleteUser({ id }: DeleteUserDTO): Promise<User> {
    const user = await this.userRepository.deleteUser(id);
    return user;
  }
}
