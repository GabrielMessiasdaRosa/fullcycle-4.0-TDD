import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { PropertyEntity } from "./property_entity";
import { UserEntity } from "./user_entity";

@Entity("bookings")
export class BookingEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  guestCount!: number;

  @Column()
  totalPrice!: number;

  @Column()
  status!: string;

  @ManyToOne(() => PropertyEntity, (property) => property.bookings)
  property!: Property;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  user!: User;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;
}
