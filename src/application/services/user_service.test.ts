import { MockUserRepository } from "../../infra/mock_user_repository";
import { CreateUserDTO } from "../dtos/user/create_user_dto";
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
    const user: CreateUserDTO = {
      name: "John Doe",
    };
    const user2: CreateUserDTO = {
      name: "Jane Doe",
    };
    const userRes1 = await userService.addUser(user);
    const userRes2 = await userService.addUser(user2);
    const users = await userService.getUsers();

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: userRes1.id,
          name: "John Doe",
        }),
        expect.objectContaining({
          id: userRes2.id,
          name: "Jane Doe",
        }),
      ])
    );
  });

  it("Deve retornar um usuário se o id for encontrado", async () => {
    const user: CreateUserDTO = {
      name: "John Doe",
    };

    const userRes = await userService.addUser(user);
    const userFound = await userService.getUserById(userRes.id);
    expect(userFound).toEqual(userRes);
  });

  it("Deve adicionar um novo usuário", async () => {
    const user: CreateUserDTO = {
      name: "John Doe",
    };
    const userRes = await userService.addUser(user);
    const userFound = await userService.getUserById(userRes.id);
    expect(userFound).toEqual(userRes);
  });

  it("Deve atualizar um usuário", async () => {
    const user: CreateUserDTO = {
      name: "John Doe",
    };
    const userRes = await userService.addUser(user);
    await userService.updateUser({ id: userRes.id, name: "Jane Doe" });
    const userFound = await userService.getUserById(userRes.id);
    expect(userFound).toEqual(
      expect.objectContaining({
        id: userRes.id,
        name: "Jane Doe",
      })
    );
  });

  it("Deve deletar um usuário", async () => {
    const user: CreateUserDTO = {
      name: "John Doe",
    };
    const userRes = await userService.addUser(user);
    await userService.deleteUser({ id: userRes.id });
    const users = await userService.getUsers();
    expect(users).toHaveLength(0);
  });

  it("Deve retornar um erro ao tentar atualiar um usuário inexistente", async () => {
    await expect(
      userService.updateUser({ id: "999", name: "Jane Doe" })
    ).rejects.toThrow("Usuário não encontrado");
  });
});
