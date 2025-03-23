import { Repository } from "typeorm";
import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { BookingEntity } from "../persistence/entity/booking_entity";
import { BookingMapper } from "../persistence/mappers/booking_mapper";

export class TypeormBookingRepository implements BookingRepository {
  private bookingRepository: Repository<BookingEntity>;
  constructor(bookingRepository: Repository<BookingEntity>) {
    this.bookingRepository = bookingRepository;
  }

  async addBooking(booking: Booking): Promise<Booking> {
    const bookingEntity = BookingMapper.toPersistence(booking);
    await this.bookingRepository.save(bookingEntity);
    return booking;
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: id },
      relations: ["property", "user"],
    });
    if (!booking) {
      throw new Error("Booking not found");
    }
    const mappedBooking = BookingMapper.toDomain(booking);
    return mappedBooking;
  }

  async getBookings(): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find();
    const mappedBookings = bookings.map((booking) =>
      BookingMapper.toDomain(booking)
    );
    return mappedBookings;
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    const bookingEntity = BookingMapper.toPersistence(booking);
    await this.bookingRepository.save(bookingEntity);
    return booking;
  }

  async deleteBooking(id: string): Promise<void> {
    await this.bookingRepository.delete(id);
  }
}
