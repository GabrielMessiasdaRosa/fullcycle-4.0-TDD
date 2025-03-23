import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entity/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("PropertyMapper", () => {
  describe("toDomain", () => {
    it("should map a PropertyEntity to a Property domain object", () => {
      const propertyEntity = new PropertyEntity();
      propertyEntity.id = "456";
      propertyEntity.title = "123 Main St";
      propertyEntity.description = "casa grande";
      propertyEntity.maxGuests = 10;
      propertyEntity.basePricePerNight = 500;
      const property = PropertyMapper.toDomain(propertyEntity);

      expect(property).toBeInstanceOf(Property);
      expect(property.id).toBe("456");
      expect(property.title).toBe("123 Main St");
      expect(property.description).toBe("casa grande");
      expect(property.maxGuests).toBe(10);
      expect(property.basePricePerNight).toBe(500);
      expect(property.bookings).toBeTruthy();
    });
  });

  describe("toPersistence", () => {
    it("should map a Property domain object to a PropertyEntity", () => {
      const property = new Property(
        "456",
        "123 Main St",
        "casa grande",
        10,
        500
      );

      const propertyEntity = PropertyMapper.toPersistence(property);

      expect(propertyEntity).toBeInstanceOf(PropertyEntity);
      expect(propertyEntity.id).toBe("456");
      expect(propertyEntity.title).toBe("123 Main St");
    });
  });
});
