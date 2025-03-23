import { Booking } from "../../../domain/entities/booking";
import { DateRange } from "../../../domain/value_objects/date_range";
import { PropertyEntity } from "../entity/property_entity";
import { UserEntity } from "../entity/user_entity";
import { BookingEntity } from "./../entity/booking_entity";
import { BookingMapper } from "./booking_mapper";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";
describe("BookingMapper", () => {
  describe("toDomain", () => {
    it("should return a Booking domain entity", () => {
      const propertyEntity = new PropertyEntity();
      propertyEntity.id = "1";
      propertyEntity.title = "Hotel";
      propertyEntity.description = "Hotel description";
      propertyEntity.maxGuests = 2;
      propertyEntity.basePricePerNight = 100;

      const userEntity = new UserEntity();
      userEntity.id = "1";
      userEntity.name = "John";

      const dateRange = new DateRange(
        new Date("2022-01-01"),
        new Date("2022-01-02")
      );

      const bookingEntity = new BookingEntity();
      bookingEntity.id = "1";
      bookingEntity.property = PropertyMapper.toDomain(propertyEntity);
      bookingEntity.user = UserMapper.toDomain(userEntity);
      bookingEntity.startDate = dateRange.getStartDate();
      bookingEntity.endDate = dateRange.getEndDate();
      bookingEntity.guestCount = 2;

      expect(BookingMapper.toDomain(bookingEntity)).toMatchObject({
        id: "1",
        property: {
          id: "1",
          title: "Hotel",
          description: "Hotel description",
          maxGuests: 2,
          basePricePerNight: 100,
        },
        user: {
          id: "1",
          name: "John",
        },
        dateRange: dateRange,
        guestCount: 2,
        status: "CONFIRMED",
        totalPrice: 100,
      });
    });
  });

  describe("toPersistence", () => {
    it("should return a Booking entity", () => {
      const propertyEntity = new PropertyEntity();
      propertyEntity.id = "1";
      propertyEntity.title = "Hotel";
      propertyEntity.description = "Hotel description";
      propertyEntity.maxGuests = 2;
      propertyEntity.basePricePerNight = 100;

      const userEntity = new UserEntity();
      userEntity.id = "1";
      userEntity.name = "John";

      const dateRange = new DateRange(
        new Date("2022-01-01"),
        new Date("2022-01-02")
      );

      const booking = new Booking(
        "1",
        PropertyMapper.toDomain(propertyEntity),
        UserMapper.toDomain(userEntity),
        dateRange,
        2
      );
      expect(BookingMapper.toPersistence(booking)).toMatchObject({
        id: "1",
        property: {
          id: "1",
          title: "Hotel",
          description: "Hotel description",
          maxGuests: 2,
          basePricePerNight: 100,
        },
        user: {
          id: "1",
          name: "John",
        },
        startDate: dateRange.getStartDate(),
        endDate: dateRange.getEndDate(),
        guestCount: 2,
        status: booking.getStatus(),
        totalPrice: booking.getTotalPrice(),
      });
    });
    describe("toPersistence - Error Handling", () => {
      it("should throw an error if domain.id is missing", () => {
        const propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.title = "Hotel";
        propertyEntity.description = "Hotel description";
        propertyEntity.maxGuests = 2;
        propertyEntity.basePricePerNight = 100;

        const userEntity = new UserEntity();
        userEntity.id = "1";
        userEntity.name = "John";

        const dateRange = new DateRange(
          new Date("2022-01-01"),
          new Date("2022-01-02")
        );

        const booking = new Booking(
          "",
          PropertyMapper.toDomain(propertyEntity),
          UserMapper.toDomain(userEntity),
          dateRange,
          2
        );

        expect(() => BookingMapper.toPersistence(booking)).toThrowError(
          "Booking ID is required"
        );
      });

      it("should throw an error if domain.user is missing", () => {
        const propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.title = "Hotel";
        propertyEntity.description = "Hotel description";
        propertyEntity.maxGuests = 2;
        propertyEntity.basePricePerNight = 100;

        const dateRange = new DateRange(
          new Date("2022-01-01"),
          new Date("2022-01-02")
        );

        const booking = new Booking(
          "1",
          PropertyMapper.toDomain(propertyEntity),
          null as any,
          dateRange,
          2
        );

        expect(() => BookingMapper.toPersistence(booking)).toThrowError(
          "User is required"
        );
      });
    });
  });
});
