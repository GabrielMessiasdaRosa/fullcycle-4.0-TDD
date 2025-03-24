import { DataSource, Repository } from "typeorm";
import { Booking } from "../../domain/entities/booking";
import { Property } from "../../domain/entities/property";
import { User } from "../../domain/entities/user";
import { DateRange } from "../../domain/value_objects/date_range";
import { BookingEntity } from "./../persistence/entity/booking_entity";
import { PropertyEntity } from "./../persistence/entity/property_entity";
import { UserEntity } from "./../persistence/entity/user_entity";
import { TypeORMBookingRepository } from "./typeorm_booking_repository";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { TypeORMUserRepository } from "./typeorm_user_repository";

describe("TypeormBookingRepository", () => {
  let dataSource: DataSource;
  let bookingRepository: TypeORMBookingRepository;
  let repository: Repository<BookingEntity>;
  let propertyRepository: TypeORMPropertyRepository;
  let repoProperty: Repository<PropertyEntity>;
  let userRepository: TypeORMUserRepository;
  let repoUser: Repository<UserEntity>;
  beforeEach(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [BookingEntity, UserEntity, PropertyEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(BookingEntity);
    bookingRepository = new TypeORMBookingRepository(repository);
    repoProperty = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repoProperty);
    repoUser = dataSource.getRepository(UserEntity);
    userRepository = new TypeORMUserRepository(repoUser);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it("Deve criar um novo booking", async () => {
    const dateRange = new DateRange(
      new Date("2021-09-01"),
      new Date("2021-09-05")
    );
    const newUser = new User("1", "John Doe");
    await userRepository.addUser(newUser);
    const user = await userRepository.getUserById("1");

    const newProperty = new Property(
      "1",
      "Casa de praia",
      "Casa de praia",
      3,
      100
    );
    await propertyRepository.addProperty(newProperty);
    const property = await propertyRepository.getPropertyById("1");

    const booking = new Booking("1", property, user, dateRange, 3);
    await bookingRepository.addBooking(booking);
    const addedBooking = await bookingRepository.getBookingById("1");
    expect(addedBooking).toEqual(booking);
  });

  it("Deve retornar um booking pelo id", async () => {
    const dateRange = new DateRange(
      new Date("2021-09-01"),
      new Date("2021-09-05")
    );
    const newUser = new User("1", "John Doe");
    await userRepository.addUser(newUser);
    const user = await userRepository.getUserById("1");

    const newProperty = new Property(
      "1",
      "Casa de praia",
      "Casa de praia",
      3,
      100
    );
    await propertyRepository.addProperty(newProperty);
    const property = await propertyRepository.getPropertyById("1");

    const booking = new Booking("1", property, user, dateRange, 3);
    await bookingRepository.addBooking(booking);
    const addedBooking = await bookingRepository.getBookingById("1");
    expect(addedBooking).toEqual(booking);
  });

  it("deve atualizar um booking", async () => {
    const dateRange = new DateRange(
      new Date("2021-09-01"),
      new Date("2021-09-05")
    );
    const newUser = new User("1", "John Doe");
    await userRepository.addUser(newUser);
    const user = await userRepository.getUserById("1");

    const newProperty = new Property(
      "1",
      "Casa de praia",
      "Casa de praia",
      3,
      100
    );
    await propertyRepository.addProperty(newProperty);
    const property = await propertyRepository.getPropertyById("1");

    await bookingRepository.addBooking(
      new Booking("1", property, user, dateRange, 3)
    );
    const updatedBooking = {
      id: "1",
      dateRange: new DateRange(new Date("2021-09-01"), new Date("2021-09-10")),
    } as Booking;
    await bookingRepository.updateBooking(updatedBooking);
    const bookingEntity = await bookingRepository.getBookingById("1");
    expect(bookingEntity.dateRange).toEqual(updatedBooking.dateRange);
    expect(bookingEntity.id).toEqual(updatedBooking.id);
    expect(bookingEntity.user).toEqual(user);
    expect(bookingEntity.guestCount).toEqual(3);
  });

  it("Deve retornar todos os bookings", async () => {
    const dateRange = new DateRange(
      new Date("2021-09-01"),
      new Date("2021-09-05")
    );
    const newUser = new User("1", "John Doe");
    await userRepository.addUser(newUser);
    const user = await userRepository.getUserById("1");

    const newProperty = new Property(
      "1",
      "Casa de praia",
      "Casa de praia",
      3,
      100
    );
    await propertyRepository.addProperty(newProperty);
    const property = await propertyRepository.getPropertyById("1");
    const booking = new Booking("1", property, user, dateRange, 3);
    await bookingRepository.addBooking(booking);
    const bookings = await bookingRepository.getBookings();
    const bookingEntity = await bookingRepository.getBookingById("1");
    expect(bookings).toContainEqual(bookingEntity);
  });

  it("Deve deletar um booking", async () => {
    const dateRange = new DateRange(
      new Date("2021-09-01"),
      new Date("2021-09-05")
    );
    const newUser = new User("1", "John Doe");
    await userRepository.addUser(newUser);
    const user = await userRepository.getUserById("1");

    const newProperty = new Property(
      "1",
      "Casa de praia",
      "Casa de praia",
      3,
      100
    );
    await propertyRepository.addProperty(newProperty);
    const property = await propertyRepository.getPropertyById("1");

    const booking = new Booking("1", property, user, dateRange, 3);
    await bookingRepository.addBooking(booking);
    await bookingRepository.deleteBooking("1");
    const bookings = await bookingRepository.getBookings();
    expect(bookings).toEqual([]);
  });
});
