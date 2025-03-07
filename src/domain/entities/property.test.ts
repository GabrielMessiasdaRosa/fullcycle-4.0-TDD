import { DateRange } from "./../value_objects/date_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";
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
    expect(property.getBookings()).toEqual([]);
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

  it("deve aplicar desconto de 10% para estadias de 7 ou mais noites", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const dateRange = new DateRange(
      new Date("2021-01-01"),
      new Date("2021-01-08")
    );
    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(630);
  });

  it("deve retornar todos os bookings da propriedade", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2021-01-01"),
      new Date("2021-01-08")
    );
    const booking = new Booking("1", property, user, dateRange, 2);

    expect(property.getBookings()).toEqual([booking]);
  });

  it("Deve adicionar um booking a um imóvel", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2021-01-01"),
      new Date("2021-01-08")
    );
    const booking = new Booking("1", property, user, dateRange, 2);

    expect(property.getBookings()).toEqual([booking]);
  });

  it("deve verificar a disponibilidade de uma propriedade", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2021-01-01"),
      new Date("2021-01-10")
    );
    const dateRange2 = new DateRange(
      new Date("2021-01-05"),
      new Date("2021-01-10")
    );
    const dateRange3 = new DateRange(
      new Date("2021-01-11"),
      new Date("2021-01-15")
    );

    const dateRange4 = new DateRange(
      new Date("2021-01-16"),
      new Date("2021-01-20")
    );

    const dateRange5 = new DateRange(
      new Date("2021-01-01"),
      new Date("2021-01-10")
    );

    new Booking("1", property, user, dateRange, 2);

    expect(property.isAvailable(dateRange2)).toBe("UNAVAILABLE");
    expect(property.isAvailable(dateRange3)).toBe("AVAILABLE");
    expect(property.isAvailable(dateRange4)).toBe("AVAILABLE");
    expect(property.isAvailable(dateRange5)).toBe("UNAVAILABLE");
  });
});
