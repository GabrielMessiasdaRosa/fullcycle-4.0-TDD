export class Property {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly description: string,
    private readonly maxGuests: number,
    private readonly basePricePerNight: number
  ) {
    this.validateProperty(title, description, maxGuests, basePricePerNight);
    this.id = id;
    this.title = title;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  private validateProperty(
    title: string,
    description: string,
    maxGuests: number,
    basePricePerNight: number
  ): void {
    if (!title) {
      throw new Error("O título da propriedade não pode ser vazio");
    }

    if (!description) {
      throw new Error("A descrição da propriedade não pode ser vazia");
    }

    if (maxGuests < 1) {
      throw new Error("O número máximo de hóspedes deve ser maior que 0");
    }

    if (basePricePerNight < 1) {
      throw new Error("O preço base por noite deve ser maior que 0");
    }
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  getBasePricePerNight(): number {
    return this.basePricePerNight;
  }
}
