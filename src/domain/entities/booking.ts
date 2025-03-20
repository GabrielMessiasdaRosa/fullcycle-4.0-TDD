import { RefundRuleFactory } from "../factories/cancelation/refund_rule_factory";
import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  readonly id: string;
  property: Property;
  user: User;
  dateRange: DateRange;
  guestCount: number;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" = "CONFIRMED";

  constructor(
    id: string,
    property: Property,
    user: User,
    dateRange: DateRange,
    guestCount: number
  ) {
    this.validateBooking(property, dateRange, guestCount);

    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.guestCount = guestCount;
    this.totalPrice = property.calculateTotalPrice(dateRange);
    property.addBooking(this);
  }
  private validateBooking(
    property: Property,
    dateRange: DateRange,
    guestCount: number
  ): void {
    const currentBookings = property.getBookings();

    for (const booking of currentBookings) {
      if (dateRange.overlaps(booking.getDateRange()) === "UNAVAILABLE") {
        throw new Error(
          "Imóvel indisponível. Já existe uma reserva confirmada para este imóvel neste período"
        );
      }
    }

    if (guestCount < 1) {
      throw new Error("Número de hóspedes inválido");
    }

    if (guestCount > property.getMaxGuests()) {
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

  getguestCount(): number {
    return this.guestCount;
  }

  getStatus(): "CONFIRMED" | "CANCELLED" | "COMPLETED" {
    return this.status;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  cancel(currentDate: Date): void {
    if (this.status === "CANCELLED") {
      throw new Error("Reserva já cancelada");
    }

    const daysBeforeCheckIn = this.dateRange.getDaysUntilCheckIn(currentDate);
    const refundRule = RefundRuleFactory.getRefundRule(daysBeforeCheckIn);
    this.totalPrice = refundRule.calculateRefund(this.totalPrice);
    this.status = "CANCELLED";
  }

  complete(): void {
    if (this.status === "CANCELLED") {
      throw new Error("Reserva cancelada");
    }
    if (this.status === "COMPLETED") {
      throw new Error("Reserva já completada");
    }

    this.status = "COMPLETED";
  }
}
