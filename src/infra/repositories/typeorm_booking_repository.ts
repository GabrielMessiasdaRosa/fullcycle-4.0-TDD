import { Repository } from "typeorm";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { BookingEntity } from "../persistence/entity/booking_entity";
import { BookingMapper } from "../persistence/mappers/booking_mapper";
import { Booking } from "./../../domain/entities/booking";

export class TypeORMBookingRepository implements BookingRepository {
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
    const bookingEntity = await this.bookingRepository.findOne({
      where: { id: id },
      relations: ["property", "user"],
    });
    if (!bookingEntity) {
      throw new Error("Booking not found");
    }
    const booking = BookingMapper.toDomain(bookingEntity);
    return booking;
  }

  async getBookings(): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find({
      relations: ["property", "user"],
    });
    const mappedBookings = bookings.map((booking) =>
      BookingMapper.toDomain(booking)
    );
    return mappedBookings;
  }

  async updateBooking(data: Partial<Booking>): Promise<Booking> {
    if (!data.id) {
      throw new Error("Booking id is required");
    }
    const booking = await this.getBookingById(data.id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    // o erro esta aqui @audit

    const updatedBooking = Object.assign({}, booking, data);

    await this.bookingRepository.save(
      BookingMapper.toPersistence(updatedBooking)
    );
    return updatedBooking;
  }

  async deleteBooking(id: string): Promise<void> {
    await this.bookingRepository.delete(id);
  }
}
