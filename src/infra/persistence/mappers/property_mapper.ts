import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entity/property_entity";

export class PropertyMapper {
  static toDomain(entity: PropertyEntity): Property {
    return new Property(
      entity.id,
      entity.title,
      entity.description,
      entity.maxGuests,
      entity.basePricePerNight
    );
  }

  static toPersistence(domain: Property): PropertyEntity {
    const entity = new PropertyEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.maxGuests = domain.maxGuests;
    entity.basePricePerNight = domain.basePricePerNight;
    entity.bookings = domain.bookings;
    return entity;
  }
}
