import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

export class Property {
  readonly id: string;
  title: string;
  description: string;
  maxGuests: number;
  basePricePerNight: number;
  bookings: Booking[] = [];
  constructor(
    id: string,
    title: string,
    description: string,
    maxGuests: number,
    basePricePerNight: number
  ) {
    this.validateProperty(title, description, maxGuests, basePricePerNight);
    this.id = id;
    this.title = title;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
    this.bookings = [];
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

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();
    let totalPrice = totalNights * this.basePricePerNight;

    if (totalNights >= 7) {
      totalPrice *= 0.9;
    }
    return totalPrice;
  }

  getBookings(): Booking[] {
    return this.bookings;
  }

  addBooking(booking: Booking): void {
    this.bookings.push(booking);
  }

  isAvailable(dateRange: DateRange): "AVAILABLE" | "UNAVAILABLE" {
    const bookings = this.getBookings();
    const booking = bookings.find((booking) => {
      if (booking.getDateRange().overlaps(dateRange) === "UNAVAILABLE") {
        return true;
      }
    });

    if (booking && booking.getStatus() === "CONFIRMED") {
      return "UNAVAILABLE";
    }

    return "AVAILABLE";
  }
}
