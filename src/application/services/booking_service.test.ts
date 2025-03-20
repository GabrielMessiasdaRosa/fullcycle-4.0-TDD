import { MockBookingRepository } from "../../infra/mock_booking_repository";
import { CreateBookingDTO } from "../dtos/booking/create_booking_dto";
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
    console.log(response);

    const response2 = await bookinService.addBooking(booking2);
    console.log(response2);
    expect(response).toHaveProperty("id");
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
});
