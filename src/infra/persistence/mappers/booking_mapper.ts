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
    return new Booking(
      entity.id,
      property,
      user,
      dateRange,
      entity.guestCount
    );
  }

  static toPersistence(domain: Booking): BookingEntity {
    const entity = new BookingEntity();
    entity.id = domain.id;
    entity.property = domain.getProperty();
    entity.user = domain.getUser();
    entity.startDate = domain.dateRange.getStartDate();
    entity.endDate = domain.dateRange.getEndDate();
    entity.guestCount = domain.guestCount;
    entity.status = domain.status;
    entity.totalPrice = domain.totalPrice;
    return entity;
  }
}
