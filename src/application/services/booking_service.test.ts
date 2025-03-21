import { MockBookingRepository } from "../../infra/mock_booking_repository";
import { CreateBookingDTO } from "../dtos/booking/create_booking_dto";
import { UpdateBookingDTO } from "../dtos/booking/update_booking_dto";
import { MockPropertyRepository } from "./../../infra/mock_property_repository";
import { MockUserRepository } from "./../../infra/mock_user_repository";
import { BookingService } from "./booking_service";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";

describe("Booking Service", () => {
  let bookinService: BookingService;
  let bookingRepository: MockBookingRepository;

  let userService: UserService;
  let mockUserRepository: MockUserRepository;

  let propertyService: PropertyService;
  let mockPropertyRepository: MockPropertyRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    userService = new UserService(mockUserRepository);
    mockPropertyRepository = new MockPropertyRepository();
    propertyService = new PropertyService(mockPropertyRepository);
    bookingRepository = new MockBookingRepository();
    bookinService = new BookingService(
      bookingRepository,
      userService,
      propertyService
    );
  });

  test("should add a booking", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const booking2: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2022-09-20"),
      checkOutDate: new Date("2022-09-25"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);

    const response2 = await bookinService.addBooking(booking2);
    expect(response).toHaveProperty("id");
    expect(response2).toHaveProperty("id");
  });

  test("should throw a error if not find booking", async () => {
    await expect(bookinService.getBookingById("1")).rejects.toThrow(
      "Booking not found"
    );
  });

  test("Should throw an error when trying to book at the same date", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const booking2: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    await bookinService.addBooking(booking);
    await expect(bookinService.addBooking(booking2)).rejects.toThrow(
      "Imóvel indisponível. Já existe uma reserva confirmada para este imóvel neste período"
    );
  });

  test("Should throw an error when trying to book with invalid guest count", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 0,
    };

    await expect(bookinService.addBooking(booking)).rejects.toThrow(
      "Número de hóspedes inválido"
    );
  });

  test("Should cancel a booking", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);
    const canceledBooking = await bookinService.cancelBooking(response.id);

    expect(canceledBooking.status).toBe("CANCELLED");
  });

  test("Should not cancel a booking that has already been canceled", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);
    await bookinService.cancelBooking(response.id);

    await expect(bookinService.cancelBooking(response.id)).rejects.toThrow(
      "Reserva já cancelada"
    );
  });

  test("Should not cancel a booking that has already been completed", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);
    await bookinService.completeBooking(response.id);

    await expect(bookinService.cancelBooking(response.id)).rejects.toThrow(
      "Booking already completed"
    );
  });

  test("should get all bookings", async () => {
    const bookings = await bookinService.getBookings();
    expect(bookings).toBeInstanceOf(Array);
  });

  test("should delete a booking", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);
    await bookinService.deleteBooking(response.id);

    await expect(bookinService.getBookingById(response.id)).rejects.toThrow(
      "Booking not found"
    );
  });

  test("should return a booking by id", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);

    const bookingById = await bookinService.getBookingById(response.id);

    expect(bookingById).toHaveProperty("id");
  });

  test("should complete a booking", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);
    const completedBooking = await bookinService.completeBooking(response.id);

    expect(completedBooking.status).toBe("COMPLETED");
  });

  test("should return an updated booking", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newUser2 = await userService.addUser({
      name: "Jane Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 200,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2022-09-01"),
      checkOutDate: new Date("2022-09-15"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);

    const updatedBooking: UpdateBookingDTO = {
      id: response.id,
      guestId: newUser2.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2022-09-01"),
      checkOutDate: new Date("2022-09-15"),
      guestCount: 3,
    };

    const updatedResponse = await bookinService.updateBooking(updatedBooking);

    expect(updatedResponse.user.getId()).toBe(newUser2.id);

    expect(updatedResponse.property.id).toBe(newProperty.id);

    expect(updatedResponse.guestCount).toBe(3);
  });

  test("should throw an error when completing an already completed booking", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);
    await bookinService.completeBooking(response.id);

    await expect(bookinService.completeBooking(response.id)).rejects.toThrow(
      "Booking already completed"
    );
  });

  test("should throw an error when canceling a non-existent booking", async () => {
    await expect(
      bookinService.cancelBooking("non-existent-id")
    ).rejects.toThrow("Booking not found");
  });

  test("should throw an error when deleting a non-existent booking", async () => {
    await expect(
      bookinService.deleteBooking("non-existent-id")
    ).resolves.toBeUndefined();
  });

  test("should throw an error when adding a booking with non-existent user or property", async () => {
    const booking: CreateBookingDTO = {
      guestId: "non-existent-user",
      propertyId: "non-existent-property",
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    await expect(bookinService.addBooking(booking)).rejects.toThrow(
      "User or Property not found"
    );
  });

  test("should throw an error when updating a booking with non-existent user or property", async () => {
    const booking: UpdateBookingDTO = {
      id: "non-existent-booking",
      guestId: "non-existent-user",
      propertyId: "non-existent-property",
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    await expect(bookinService.updateBooking(booking)).rejects.toThrow(
      "User or Property not found"
    );
  });

  test("should delete a booking successfully", async () => {
    const newUser = await userService.addUser({
      name: "John Doe",
    });
    const newProperty = await propertyService.addProperty({
      title: "Property 1",
      description: "Description 1",
      basePricePerNight: 100,
      maxGuests: 5,
    });

    const booking: CreateBookingDTO = {
      guestId: newUser.id,
      propertyId: newProperty.id,
      checkInDate: new Date("2021-09-01"),
      checkOutDate: new Date("2021-09-15"),
      guestCount: 2,
    };

    const response = await bookinService.addBooking(booking);
    await bookinService.deleteBooking(response.id);

    await expect(bookinService.getBookingById(response.id)).rejects.toThrow(
      "Booking not found"
    );
  });
});
