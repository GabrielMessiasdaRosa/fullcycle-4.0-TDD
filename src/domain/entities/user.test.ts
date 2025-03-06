import { User } from "./user";
describe("User Entity", () => {
  it("Deve criar uma instancia de user com ID e Nome", () => {
    const user = new User("1", "John Doe");
    expect(user.getId()).toBe("1");
    expect(user.getName()).toBe("John Doe");
  });

  it("Deve lançar um erro se o nome do usuário for vazio", () => {
    expect(() => new User("1", "")).toThrow(
      "O nome do usuário não pode ser vazio"
    );
  });
  it("Deve lançar um erro se o ID do usuário for vazio", () => {
    expect(() => new User("", "John Doe")).toThrow(
      "O ID do usuário não pode ser vazio"
    );
  });
});
