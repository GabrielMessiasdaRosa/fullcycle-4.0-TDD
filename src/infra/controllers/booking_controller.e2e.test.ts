import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { CreateBookingDTO } from "../../application/dtos/booking/create_booking_dto";
import { BookingService } from "../../application/services/booking_service";
import { PropertyService } from "../../application/services/property_service";
import { UserService } from "../../application/services/user_service";
import { BookingEntity } from "../persistence/entity/booking_entity";
import { PropertyEntity } from "../persistence/entity/property_entity";
import { UserEntity } from "../persistence/entity/user_entity";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { TypeORMBookingRepository } from "./../repositories/typeorm_booking_repository";
import { TypeORMPropertyRepository } from "./../repositories/typeorm_property_repository";
import { BookingController } from "./booking_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeORMPropertyRepository;
let userRepository: TypeORMUserRepository;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;
let bookingController: BookingController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [BookingEntity, PropertyEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  bookingRepository = new TypeORMBookingRepository(
    dataSource.getRepository(BookingEntity)
  );
  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );
  userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );

  propertyService = new PropertyService(propertyRepository);
  userService = new UserService(userRepository);
  bookingService = new BookingService(
    bookingRepository,
    userService,
    propertyService
  );

  bookingController = new BookingController(bookingService);

  app.post("/bookings", (req, res, next) => {
    bookingController.createBooking(req, res).catch((err) => next(err));
  });

  app.post("/bookings/:id/cancel", (req, res, next) => {
    bookingController.cancelBooking(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("BookingController", () => {
  beforeAll(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);
    const userRepo = dataSource.getRepository(UserEntity);
    const bookingRepo = dataSource.getRepository(BookingEntity);

    await bookingRepo.clear();
    await propertyRepo.clear();
    await userRepo.clear();

    await propertyRepo.save({
      id: "1",
      title: "Propriedade de Teste",
      description: "Um lugar incrível para ficar",
      maxGuests: 5,
      basePricePerNight: 100,
    });

    await userRepo.save({
      id: "1",
      name: "Usuário de Teste",
    });
  });

  it("deve criar uma reservar com sucesso", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Booking created successfully");
    expect(response.body.booking).toHaveProperty("id");
    expect(response.body.booking).toHaveProperty("totalPrice");
  });

  it("deve retornar 400 ao tentar criar um reserva com data de início inválida", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "invalid-date",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Data de início ou fim inválida.");
  });

  it("deve retornar 400 ao tentar criar um reserva com data de fim inválida", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "invalid-date",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Data de início ou fim inválida.");
  });

  it("deve retornar 400 ao tentar criar um reserva com número de hóspedes inválido", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Número de hóspedes inválido");
  });

  it("deve retornar 400 ao tentar criar uma reserva com propertyId inválido", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "invalid-id",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Property not found");
  });

  it("deve cancelar uma reserva", async () => {
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() + 4));
    const endDate = new Date(now.setDate(now.getDate() + 14));

    const createBookingReq: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: startDate,
      endDate: endDate,
      guestCount: 2,
    };
    const booking = await bookingService.addBooking(createBookingReq);
    const cancelResponse = await request(app).post(
      `/bookings/${booking.getId()}/cancel`
    );
    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.message).toBe("Reserva cancelada com sucesso.");
  });

  it("deve retornar erro ao cancelar uma reserva inexistente", async () => {
    const cancelResponse = await request(app).post(`/bookings/999/cancel`);

    expect(cancelResponse.status).toBe(400);
    expect(cancelResponse.body.message).toBe(
      "Bad Request: Verifique o corpo da requisição"
    );
  });
});
