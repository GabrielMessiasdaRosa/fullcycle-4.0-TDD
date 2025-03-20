import { CreateBookingDTO } from "./create_booking_dto";

export interface UpdateBookingDTO extends CreateBookingDTO {
  id: string;
}
