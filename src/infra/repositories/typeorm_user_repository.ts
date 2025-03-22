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
    const users = await this.userRepository.find();
    return users.map((user) => new User(user.id, user.name));
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneByOrFail({
      id: id,
    });
    const mappedUser = UserMapper.toDomain(user);
    return mappedUser;
  }

  async updateUser(data: { id: string; name: string }): Promise<User> {
    await this.userRepository.update(data.id, { name: data.name });
    return new User(data.id, data.name);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
