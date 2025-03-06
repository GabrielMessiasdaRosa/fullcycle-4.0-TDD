import { DateRange } from "./../value_objects/date_range";
import { Property } from "./property";
describe("Property Entity", () => {
  it("Deve criar uma instancia de propriedade com todos os atributos", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );

    expect(property.getId()).toBe("1");
    expect(property.getTitle()).toBe("Casa com 3 quartos");
    expect(property.getDescription()).toBe(
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem"
    );
    expect(property.getMaxGuests()).toBe(6);
    expect(property.getBasePricePerNight()).toBe(100);
  });

  it("deve lançar um erro se o título for vazio", () => {
    expect(() => {
      new Property(
        "1",
        "",
        "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
        6,
        100
      );
    }).toThrow("O título da propriedade não pode ser vazio");
  });
  it("deve lançar um erro se a descrição for vazia", () => {
    expect(() => {
      new Property("1", "Casa com 3 quartos", "", 6, 100);
    }).toThrow("A descrição da propriedade não pode ser vazia");
  });
  it("deve lançar um erro se o número máximo de hóspedes for menor que 1", () => {
    expect(() => {
      new Property(
        "1",
        "Casa com 3 quartos",
        "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
        0,
        100
      );
    }).toThrow("O número máximo de hóspedes deve ser maior que 0");
  });
  it("deve lançar um erro se o preço base por noite for menor que 1", () => {
    expect(() => {
      new Property(
        "1",
        "Casa com 3 quartos",
        "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
        6,
        0
      );
    }).toThrow("O preço base por noite deve ser maior que 0");
  });

  it("nao deve aplicar desconto para estadias menores que 7 noites", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const dateRange = new DateRange(
      new Date("2021-01-01"),
      new Date("2021-01-05")
    );
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(400);
  });
});
