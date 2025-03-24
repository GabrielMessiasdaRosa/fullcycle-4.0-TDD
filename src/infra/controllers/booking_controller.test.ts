import { Request, Response } from "express";
import { CreateBookingDTO } from "../../application/dtos/booking/create_booking_dto";
import { BookingService } from "../../application/services/booking_service";
import { BookingController } from "./booking_controller";

describe("BookingController", () => {
  let bookingService: jest.Mocked<BookingService>;
  let bookingController: BookingController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    bookingService = {
      addBooking: jest.fn(),
      cancelBooking: jest.fn(),
    } as unknown as jest.Mocked<BookingService>;

    bookingController = new BookingController(bookingService);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createBooking", () => {
    it("should create a booking successfully", async () => {
      const mockBooking = {
        getId: jest.fn().mockReturnValue("1"),
        getProperty: jest.fn().mockReturnValue({ getId: () => "1" }),
        getUser: jest.fn().mockReturnValue({ getId: () => "1" }),
        getDateRange: jest.fn().mockReturnValue({
          getStartDate: () => "2024-12-20",
          getEndDate: () => "2024-12-25",
        }),
        getguestCount: jest.fn().mockReturnValue(2),
        getTotalPrice: jest.fn().mockReturnValue(500),
        getStatus: jest.fn().mockReturnValue("CONFIRMED"),
      };

      bookingService.addBooking.mockResolvedValue(mockBooking as any);

      mockRequest.body = {
        propertyId: "1",
        userId: "1",
        startDate: "2024-12-20",
        endDate: "2024-12-25",
        guestCount: 2,
      };

      await bookingController.createBooking(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(bookingService.addBooking).toHaveBeenCalledWith({
        propertyId: "1",
        guestId: "1",
        startDate: new Date("2024-12-20"),
        endDate: new Date("2024-12-25"),
        guestCount: 2,
      } as CreateBookingDTO);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Booking created successfully",
        booking: {
          id: "1",
          propertyId: "1",
          guestId: "1",
          startDate: "2024-12-20",
          endDate: "2024-12-25",
          guestCount: 2,
          totalPrice: 500,
          status: "CONFIRMED",
        },
      });
    });

    it("should return 400 for invalid startDate or endDate", async () => {
      mockRequest.body = {
        propertyId: "1",
        userId: "1",
        startDate: "invalid-date",
        endDate: "2024-12-25",
        guestCount: 2,
      };

      await bookingController.createBooking(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Data de início ou fim inválida.",
      });
    });

    it("should return 400 for unexpected errors", async () => {
      bookingService.addBooking.mockRejectedValue(
        new Error("Unexpected error")
      );

      mockRequest.body = {
        propertyId: "1",
        userId: "1",
        startDate: "2024-12-20",
        endDate: "2024-12-25",
        guestCount: 2,
      };

      await bookingController.createBooking(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Unexpected error",
      });
    });
  });

  describe("cancelBooking", () => {
    it("should cancel a booking successfully", async () => {
      mockRequest.params = { id: "1" };

      await bookingController.cancelBooking(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(bookingService.cancelBooking).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Reserva cancelada com sucesso.",
      });
    });

    it("should return 400 if booking is not found", async () => {
      bookingService.cancelBooking.mockRejectedValue(new Error("Not found"));

      mockRequest.params = { id: "999" };

      await bookingController.cancelBooking(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Bad Request: Verifique o corpo da requisição",
      });
    });
  });
});
