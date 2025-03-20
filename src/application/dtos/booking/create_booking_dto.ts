export interface CreateBookingDTO {
  propertyId: string;
  guestId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
}
