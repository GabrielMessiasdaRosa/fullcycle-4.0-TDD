import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { Property } from "./property";
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

  it("Deve trazer todos os bookings do usuário", () => {
    const user = new User("1", "John Doe");
    const property = new Property("1", "Casa de Praia", "Casa", 3, 300);
    const dateRange = new DateRange(
      new Date("2022-12-12"),
      new Date("2022-12-13")
    );
    const booking = new Booking("1", property, user, dateRange, 2);
    user.addBooking(booking);
    expect(user.getBookings()).toEqual([booking]);
  });
});
