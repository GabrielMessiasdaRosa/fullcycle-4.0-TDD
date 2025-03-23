import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "../../../domain/entities/booking";
import { BookingEntity } from "./booking_entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => BookingEntity, (booking) => booking.user, {
    nullable: false,
  })
  bookings!: Booking[];
}
