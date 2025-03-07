import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  constructor(
    private readonly id: string,
    private readonly property: Property,
    private readonly user: User,
    private readonly dateRange: DateRange,
    private readonly numberOfGuests: number,
    private readonly status: "CONFIRMED" | "CANCELLED" = "CONFIRMED"
  ) {
    this.validateBooking(property, dateRange);
    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.numberOfGuests = numberOfGuests;

    property.addBooking(this);
  }
  private validateBooking(property: Property, dateRange: DateRange): void {
    const bookings = property.getBookings();
    const booking = bookings.find((booking) =>
      booking.getDateRange().overlaps(dateRange)
    );
    if (booking && booking.getStatus() === "CONFIRMED") {
      throw new Error(
        "Imóvel indisponível. Já existe uma reserva confirmada para este imóvel neste período"
      );
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
}
