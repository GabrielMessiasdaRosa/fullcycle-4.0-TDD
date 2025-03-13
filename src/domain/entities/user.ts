export class User {
  readonly id: string;
  readonly name: string;
  constructor(id: string, name: string) {
    this.validations(id, name);
    this.id = id;
    this.name = name;
  }
  private validations(id: string, name: string) {
    if (!id) {
      throw new Error("O ID do usuário não pode ser vazio");
    }
    if (!name) {
      throw new Error("O nome do usuário não pode ser vazio");
    }
  }
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
