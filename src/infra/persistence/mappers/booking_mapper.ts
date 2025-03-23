import { Booking } from "../../../domain/entities/booking";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entity/booking_entity";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";

export class BookingMapper {
  static toDomain(entity: BookingEntity): Booking {
    const property = PropertyMapper.toDomain(entity.property);
    const user = UserMapper.toDomain(entity.user);
    const dateRange = new DateRange(entity.startDate, entity.endDate);
    return new Booking(entity.id, property, user, dateRange, entity.guestCount);
  }

  static toPersistence(domain: Booking): BookingEntity {
    const entity = new BookingEntity();
    entity.id = domain.id;
    entity.property = domain.property
    entity.user = domain.user
    entity.startDate = domain.dateRange.getStartDate();
    entity.endDate = domain.dateRange.getEndDate();
    entity.guestCount = domain.guestCount;
    entity.status = domain.status;
    entity.totalPrice = domain.totalPrice;
    this.validateEntity(entity);
    return entity;
  }

  static validateEntity(entity: BookingEntity): void {
    if (!entity.id) {
      throw new Error("Booking ID is required");
    }
    if (!entity.startDate) {
      throw new Error("Booking start date is required");
    }
    if (!entity.endDate) {
      throw new Error("Booking end date is required");
    }
    if (!entity.guestCount) {
      throw new Error("Booking guest count is required");
    }
    if (!entity.totalPrice) {
      throw new Error("Booking total price is required");
    }
    if (!entity.status) {
      throw new Error("Booking status is required");
    }
    if (!entity.property) {
      throw new Error("Booking property is required");
    }
    if (!entity.user) {
      throw new Error("User is required");
    }
  }
}
