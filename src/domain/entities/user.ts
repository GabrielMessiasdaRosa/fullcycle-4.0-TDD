import { Booking } from "./booking";

export class User {
  readonly id: string;
  name: string;
  bookings: Booking[] = [];
  constructor(id: string, name: string) {
    this.validations(id, name);
    this.id = id;
    this.name = name;
    this.bookings = [];
  }
  private validations(id: string, name: string) {
    if (!id) {
      throw new Error("O ID do usuário não pode ser vazio");
    }
    if (!name) {
      throw new Error("O nome do usuário não pode ser vazio");
    }
  }

  addBooking(booking: Booking) {
    this.bookings.push(booking);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getBookings(): Booking[] {
    return this.bookings;
  }
}
