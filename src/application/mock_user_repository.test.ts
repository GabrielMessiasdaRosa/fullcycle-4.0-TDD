import { UserType } from "../types/user_type";
import { MockUserRepository } from "./mock_user_repository";

describe("MockUserRepository", () => {
  let userRepository = new MockUserRepository();
  beforeEach(() => {
    userRepository = new MockUserRepository();
  });
  it("Deve retonar null se o id não for encontrado", async () => {
    const user = await userRepository.getUserById("123");
    expect(user).toBeNull();
  });
  it("deve adicionar um novo usuário", async () => {
    const user = {
      id: "1",
      name: "John Doe",
    };
    await userRepository.addUser(user);
    const userFound = await userRepository.getUserById("1");
    expect(userFound).toEqual(user);
  });
  it("Deve retornar um usuário se o id for encontrado", async () => {
    const user: UserType = {
      id: "1",
      name: "John Doe",
    };
    userRepository.addUser(user);
    const userFound = await userRepository.getUserById("1");
    expect(userFound).toEqual(user);
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
    await userRepository.addUser(user);
    await userRepository.addUser(user2);
    const users = await userRepository.getUsers();
    expect(users).toEqual([user, user2]);
  });

  it("Deve retornar null se o id não for encontrado", async () => {
    const user = await userRepository.getUserById("999");
    expect(user).toBeNull();
  });

  it("deve atualizar um usuário", async () => {
    const user = {
      id: "1",
      name: "John Doe",
    };
    await userRepository.addUser(user);
    const userUpdated = {
      id: "1",
      name: "Jane Doe",
    };
    await userRepository.updateUser(userUpdated);
    const userFound = await userRepository.getUserById("1");
    expect(userFound).toEqual(userUpdated);
  });
  it("deve deletar um usuário", async () => {
    const user = {
      id: "1",
      name: "John Doe",
    };
    await userRepository.addUser(user);
    await userRepository.deleteUser("1");
    const userFound = await userRepository.getUserById("1");
    expect(userFound).toBeNull();
  });
});
