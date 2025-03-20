import { v4 as uuidv4 } from "uuid";
import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { DateRange } from "../../domain/value_objects/date_range";
import { CreateBookingDTO } from "../dtos/booking/create_booking_dto";
import { UpdateBookingDTO } from "../dtos/booking/update_booking_dto";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";

export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly userService: UserService,
    private readonly propertyService: PropertyService
  ) {
    this.bookingRepository = bookingRepository;
    this.userService = userService;
    this.propertyService = propertyService;
  }

  async getBookings() {
    const bookings = await this.bookingRepository.getBookings();
    return bookings;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const booking = await this.bookingRepository.getBookingById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  }

  async addBooking(booking: CreateBookingDTO): Promise<Booking> {
    const guest = await this.userService.getUserById(booking.guestId);
    const property = await this.propertyService.getPropertyById(
      booking.propertyId
    );
    if (!guest || !property) {
      throw new Error("User or Property not found");
    }
    const id = uuidv4();

    const dateRange = new DateRange(booking.checkInDate, booking.checkOutDate);

    const newBooking = new Booking(
      id,
      property,
      guest,
      dateRange,
      booking.guestCount
    );

    const response = await this.bookingRepository.addBooking(newBooking);
    return response;
  }

  async updateBooking(booking: UpdateBookingDTO): Promise<Booking> {
    const guest = await this.userService.getUserById(booking.guestId);
    const property = await this.propertyService.getPropertyById(
      booking.propertyId
    );
    if (!guest || !property) {
      throw new Error("User or Property not found");
    }
    const dateRange = new DateRange(booking.checkInDate, booking.checkOutDate);

    const updatedBooking = new Booking(
      booking.id,
      property,
      guest,
      dateRange,
      booking.guestCount
    );

    const response = await this.bookingRepository.updateBooking(updatedBooking);
    return response;
  }

  async cancelBooking(id: string) {
    const booking = await this.bookingRepository.getBookingById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
     if (booking.getStatus() === "COMPLETED") {
      throw new Error("Booking already completed");
    }
    booking.cancel(new Date());
    const newBooking = await this.bookingRepository.updateBooking(booking);
    return newBooking;
  }

  async deleteBooking(id: string) {
    await this.bookingRepository.deleteBooking(id);
  }

  async completeBooking(id: string) {
    const booking = await this.bookingRepository.getBookingById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    if (booking.getStatus() === "COMPLETED") {
      throw new Error("Booking already completed");
    }
    booking.complete();
    const newBooking = await this.bookingRepository.updateBooking(booking);
    return newBooking;
  }
}
