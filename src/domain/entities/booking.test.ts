import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";

describe("Booking Entity", () => {
  it("Deve criar uma instancia de reserva com todos os atributos", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    expect(booking.getId()).toBe("1");
    expect(booking.getProperty()).toBe(property);
    expect(booking.getUser()).toBe(user);
    expect(booking.getDateRange()).toBe(dateRange);
    expect(booking.getguestCount()).toBe(2);
    expect(booking.getTotalPrice()).toBe(500);
    expect(booking.getStatus()).toBe("CONFIRMED");
  });

  it("Deve lançar um erro ao tentar criar uma reserva para um imóvel que já possui uma reserva confirmada para o mesmo período", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    new Booking("1", property, user, dateRange, 2);

    const dateRange2 = new DateRange(
      new Date("2024-12-26"),
      new Date("2024-12-31")
    );

    expect(() => {
      new Booking("2", property, user, dateRange2, 2);
    }).toThrow(
      "Imóvel indisponível. Já existe uma reserva confirmada para este imóvel neste período"
    );
  });

  it("Deve lançar um erro ao tentar criar uma reserva com numero de hospeder menor que 1", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    expect(() => {
      new Booking("1", property, user, dateRange, 0);
    }).toThrow("Número de hóspedes inválido");
  });

  it("Deve lançar um erro ao tentar criar uma reserva com numero de hospeder maior que a capacidade do imóvel", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    expect(() => {
      new Booking("1", property, user, dateRange, 7);
    }).toThrow("Número de hóspedes excede a capacidade do imóvel");
  });

  it("deve lançar um erro ao tentar cancelar uma reserva já cancelada", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    booking.cancel(new Date("2024-12-24"));

    expect(() => {
      booking.cancel(new Date("2024-12-24"));
    }).toThrow("Reserva já cancelada");
  });
  /* _______________________ AQUI !  */

  it("deve cancelar uma reserva sem reembolso caso falte 1 dia para o check-in", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    booking.cancel(new Date("2024-12-24"));

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(500);
  });

  it("deve cancelar uma reserva sem reembolso caso da estadia ja tenha começado", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    booking.cancel(new Date("2024-12-25"));

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(500);
  });

  it("Deve cancelar a reserva com reembolso de 50% caso a data de cancelamento seja até 3 dias antes da data de check-in", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    booking.cancel(new Date("2024-12-23"));

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(250);
  });

  it("Deve cancelar a reserva com reembolso de 100% caso a data de cancelamento seja mais de 3 dias antes da data de check-in", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    booking.cancel(new Date("2024-12-20"));

    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(0);
  });

  it("Deve lançar um erro ao tentar cancelar uma reserva que já foi cancelada", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    booking.cancel(new Date("2024-12-20"));

    expect(() => {
      booking.cancel(new Date("2024-12-20"));
    }).toThrow("Reserva já cancelada");
  });

  test("Deve completar a reserva com sucesso", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    booking.complete();

    expect(booking.getStatus()).toBe("COMPLETED");
  });

  test("Deve lançar um erro ao tentar completar uma reserva que já foi completada", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    booking.complete();

    expect(() => {
      booking.complete();
    }).toThrow("Reserva já completada");
  });

  test("Deve lançar um erro ao tentar completar uma reserva que foi cancelada", () => {
    const property = new Property(
      "1",
      "Casa com 3 quartos",
      "Casa com 3 quartos, 2 banheiros e 1 vaga na garagem",
      6,
      100
    );
    const user = new User("1", "John Doe");
    const dateRange = new DateRange(
      new Date("2024-12-25"),
      new Date("2024-12-30")
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    booking.cancel(new Date("2024-12-20"));

    expect(() => {
      booking.complete();
    }).toThrow("Reserva cancelada");
  });
});
