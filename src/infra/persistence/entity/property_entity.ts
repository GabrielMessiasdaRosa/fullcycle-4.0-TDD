import { Length } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "../../../domain/entities/booking";
import { BookingEntity } from "./booking_entity";

@Entity("properties")
export class PropertyEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Length(1, 1000)
  @Column()
  description!: string;

  @Column()
  maxGuests!: number;

  @Column()
  basePricePerNight!: number;

  // uma propriedade tem várias reservas
  @OneToMany(() => BookingEntity, (booking) => booking.property, {
    nullable: true,
  })
  bookings!: Booking[];
}
