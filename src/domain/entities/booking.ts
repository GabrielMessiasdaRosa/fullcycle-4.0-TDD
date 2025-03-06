import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly user: User;
  private readonly dateRange: DateRange;
  private readonly numberOfGuests: number;
  constructor(
    id: string,
    property: Property,
    user: User,
    dateRange: DateRange,
    numberOfGuests: number
  ) {
    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.numberOfGuests = numberOfGuests;
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
}
