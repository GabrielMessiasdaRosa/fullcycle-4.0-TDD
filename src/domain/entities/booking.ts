import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  private totalPrice: number;
  constructor(
    private readonly id: string,
    private readonly property: Property,
    private readonly user: User,
    private readonly dateRange: DateRange,
    private readonly numberOfGuests: number,
    private status: "CONFIRMED" | "CANCELLED" = "CONFIRMED"
  ) {
    this.validateBooking(property, dateRange, numberOfGuests);

    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.numberOfGuests = numberOfGuests;
    this.totalPrice = property.calculateTotalPrice(dateRange);
    property.addBooking(this);
  }
  private validateBooking(
    property: Property,
    dateRange: DateRange,
    numberOfGuests: number
  ): void {
    const bookings = property.getBookings();
    const booking = bookings.find((booking) =>
      booking.getDateRange().overlaps(dateRange)
    );
    if (booking && booking.getStatus() === "CONFIRMED") {
      throw new Error(
        "Imóvel indisponível. Já existe uma reserva confirmada para este imóvel neste período"
      );
    }

    if (numberOfGuests < 1) {
      throw new Error("Número de hóspedes inválido");
    }

    if (numberOfGuests > property.getMaxGuests()) {
      throw new Error("Número de hóspedes excede a capacidade do imóvel");
    }
  }

  getId(): string {
    return this.id;
  }

  getProperty(): Property {
    return this.property;
  }

  getUser(): User {
    return this.user;
  }

  getDateRange(): DateRange {
    return this.dateRange;
  }

  getNumberOfGuests(): number {
    return this.numberOfGuests;
  }

  getStatus(): "CONFIRMED" | "CANCELLED" {
    return this.status;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  cancel(currentDate: Date): void {
    const daysBeforeCheckIn = this.dateRange.getDaysUntil(currentDate);

    if (this.status === "CANCELLED") {
      throw new Error("Reserva já cancelada");
    }

    if (daysBeforeCheckIn <= 1) {
      this.status = "CANCELLED";
      return;
    }

    if (daysBeforeCheckIn <= 3) {
      this.status = "CANCELLED";
      this.totalPrice = this.totalPrice * 0.5;
      return;
    }

    if (daysBeforeCheckIn > 3) {
      this.status = "CANCELLED";
      this.totalPrice = 0;
      return;
    }

    this.status = "CANCELLED";
  }
}
