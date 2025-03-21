import { Booking } from "../entities/booking";

export interface BookingRepository {
  getBookings(): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | null>;
  addBooking(booking: Booking): Promise<Booking>;
  updateBooking(booking: Partial<Booking>): Promise<Booking>;
  deleteBooking(id: string): Promise<void>;
}
