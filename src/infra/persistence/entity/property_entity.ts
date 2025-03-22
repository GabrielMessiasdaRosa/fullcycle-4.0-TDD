import { Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "../../../domain/entities/booking";

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

  bookings!: Booking[];
}
