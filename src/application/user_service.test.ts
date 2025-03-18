import { MockUserRepository } from "../infra/mock_user_repository";
import { UserService } from "./user_service";
describe("UserService", () => {
  let UserRepositoryMock: MockUserRepository;
  let userService: UserService;
  beforeEach(() => {
    UserRepositoryMock = new MockUserRepository();
    userService = new UserService(UserRepositoryMock);
  });

  it("Deve retornar null quando id informado for inválido", async () => {
    const user = await userService.getUserById("999");
    expect(user).toBeNull();
  });

  it("Deve retornar uma lista de usuários", async () => {
    const user = {
      id: "1",
      name: "John Doe",
    };
    const user2 = {
      id: "2",
      name: "Jane Doe",
    };
    await userService.addUser(user);
    await userService.addUser(user2);
    const users = await userService.getUsers();
    expect(users).toEqual([user, user2]);
  });

  it("Deve retornar um usuário se o id for encontrado", async () => {
    const user = {
      id: "1",
      name: "John Doe",
    };
    await userService.addUser(user);
    const userFound = await UserRepositoryMock.getUserById("1");
    expect(userFound?.getId()).toBe("1");
    expect(userFound?.getName()).toBe("John Doe");
  });

  it("Deve adicionar um novo usuário", async () => {
    const user = {
      id: "1",
      name: "John Doe",
    };
    await userService.addUser(user);
    const userFound = await userService.getUserById("1");
    expect(userFound?.getId()).toBe("1");
    expect(userFound?.getName()).toBe("John Doe");
  });

  it("Deve atualizar um usuário", async () => {
    const user = {
      id: "1",
      name: "John Doe",
    };
    await userService.addUser(user);
    const userUpdated = {
      id: "1",
      name: "Jane Doe",
    };
    await userService.updateUser(userUpdated);
    const userFound = await userService.getUserById("1");
    expect(userFound).toEqual(userUpdated);
  });

  it("Deve deletar um usuário", async () => {
    const user = {
      id: "1",
      name: "John Doe",
    };
    await userService.addUser(user);
    await userService.deleteUser("1");
    const userFound = await userService.getUserById("1");
    expect(userFound).toBeNull();
  });
});
