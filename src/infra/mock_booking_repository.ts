import { Booking } from "../domain/entities/booking";
import { BookingRepository } from "../domain/repositories/booking_repository";
export class MockBookingRepository implements BookingRepository {
  private bookings: Booking[] = [];

  async getBookings(): Promise<Booking[]> {
    return this.bookings;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookings.find((booking) => booking.id === id) || null;
  }

  async addBooking(booking: Booking): Promise<Booking> {
    this.bookings.push(booking);
    return booking;
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    const index = this.bookings.findIndex((b) => b.id === booking.id);
    this.bookings[index] = booking;
    return this.bookings[index];
  }

  async deleteBooking(id: string): Promise<void> {
    this.bookings = this.bookings.filter((booking) => booking.id !== id);
  }
}
