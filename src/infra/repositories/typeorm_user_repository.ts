import { Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { UserEntity } from "../persistence/entity/user_entity";
import { UserMapper } from "../persistence/mappers/user_mapper";

export class TypeORMUserRepository implements UserRepository {
  private userRepository: Repository<UserEntity>;

  constructor(userRepository: Repository<UserEntity>) {
    this.userRepository = userRepository;
  }

  async addUser(user: User): Promise<User> {
    const userEntity = UserMapper.toPersistence(user);
    await this.userRepository.save(userEntity);
    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: ["bookings"],
    });
    const mappedUsers = users.map((user) => UserMapper.toDomain(user));
    return mappedUsers;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["bookings"],
    });
    if (!user) {
      throw new Error("User not found");
    }
    const mappedUser = UserMapper.toDomain(user);
    return mappedUser;
  }

  async updateUser(data: User): Promise<User> {
    await this.userRepository.update(data.id, { name: data.getName() });
    const mappedUser = UserMapper.toDomain(data);
    return mappedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
