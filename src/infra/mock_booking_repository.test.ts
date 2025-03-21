import { Booking } from "../domain/entities/booking";
import { Property } from "../domain/entities/property";
import { User } from "../domain/entities/user";
import { DateRange } from "../domain/value_objects/date_range";
import { MockBookingRepository } from "./mock_booking_repository";

describe("Mock Booking Repository", () => {
  let repository: MockBookingRepository;
  let user: User;
  let property: Property;
  beforeEach(() => {
    repository = new MockBookingRepository();
    user = new User("1", "John Doe");
    property = new Property("1", "Property 1", "Description 1", 5, 100);
  });

  test("should add a booking", async () => {
    const dateRange = new DateRange(
      new Date("2021-09-01"),
      new Date("2021-09-15")
    );
    const booking = new Booking("1", property, user, dateRange, 2);
    const response = await repository.addBooking(booking);
    expect(response).toBe(booking);

    const bookings = await repository.getBookings();
    expect(bookings).toContain(booking);
  });

  test("Should update a booking", async () => {
    const dateRange = new DateRange(
      new Date("2021-09-01"),
      new Date("2021-09-15")
    );
    const booking = new Booking("1", property, user, dateRange, 3);
    await repository.addBooking(booking);

    const updatedBooking = {
      id: "1",
      guestCount: 2,
    } as Booking;
    const response = await repository.updateBooking(updatedBooking);
    expect(response).toBe(updatedBooking);
    expect(response.guestCount).toBe(2);
  });
});
