import "reflect-metadata";
import { DataSource, Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { BookingEntity } from "../persistence/entity/booking_entity";
import { PropertyEntity } from "../persistence/entity/property_entity";
import { UserEntity } from "./../persistence/entity/user_entity";
import { TypeORMUserRepository } from "./typeorm_user_repository";

describe("TypeOrmUserRepository", () => {
  let dataSource: DataSource;
  let userRepository: TypeORMUserRepository;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [UserEntity, BookingEntity, PropertyEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(UserEntity);
    userRepository = new TypeORMUserRepository(repository);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve salvar um usuário com sucesso no banco de dados", async () => {
    // Arrange
    const user = new User("1", "John Doe");
    await userRepository.addUser(user);
    const savedUser = await userRepository.getUserById("1");
    const users = await userRepository.getUsers();

    expect(savedUser).toEqual(user);
    expect(users).toContainEqual(user);
  });

  it("deve retornar um usuário pelo id", async () => {
    // Arrange
    const user = new User("2", "John Doe");
    await userRepository.addUser(user);
    const savedUser = await userRepository.getUserById("2");

    expect(savedUser).toEqual(user);
  });

  it("deve retornar todos os usuários", async () => {
    // Arrange
    const user1 = new User("3", "John Doe");
    const user2 = new User("4", "Jane Doe");
    await userRepository.addUser(user1);
    await userRepository.addUser(user2);
    const users = await userRepository.getUsers();

    expect(users).toContainEqual(user1);
    expect(users).toContainEqual(user2);
  });

  it("deve remover um usuário pelo id", async () => {
    // Arrange
    const user = new User("5", "John Doe");
    await userRepository.addUser(user);
    await userRepository.deleteUser("5");
    const users = await userRepository.getUsers();

    expect(users).not.toContainEqual(user);
  });

  it("deve atualizar um usuário pelo id", async () => {
    // Arrange
    const user = new User("6", "John Doe");
    await userRepository.addUser(user);
    const updatedUser = new User("6", "Jane Doe");
    await userRepository.updateUser(updatedUser);
    const savedUser = await userRepository.getUserById("6");

    expect(savedUser).toEqual(updatedUser);
  });
});
