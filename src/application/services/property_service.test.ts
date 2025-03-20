import { CreatePropertyDTO } from "../dtos/property/create_property_dto";
import { MockPropertyRepository } from "./../../infra/mock_property_repository";
import { PropertyService } from "./property_service";

describe("PropertyService", () => {
  let propertyService: PropertyService;
  let propertyRepository: MockPropertyRepository;

  beforeEach(() => {
    propertyRepository = new MockPropertyRepository();
    propertyService = new PropertyService(propertyRepository);
  });

  it("should create a new property", async () => {
    const property: CreatePropertyDTO = {
      title: "Property 1",
      description: "Description 1",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    const createdProperty = await propertyService.addProperty(property);
    const properties = await propertyService.getProperties();
    expect(properties).toEqual([
      expect.objectContaining({
        id: createdProperty.id, // Verifica o UUID gerado
        title: "Property 1",
        description: "Description 1",
        maxGuests: 1,
        basePricePerNight: 1,
        bookings: [],
      }),
    ]);
  });

  it("should update a property", async () => {
    const property: CreatePropertyDTO = {
      title: "Property 1",
      description: "Description 1",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    const createdProperty = await propertyService.addProperty(property);
    await propertyService.updateProperty({
      id: createdProperty.id,
      title: "Updated Property",
    });
    const updatedProperty = await propertyService.getPropertyById(
      createdProperty.id
    );
    expect(updatedProperty?.title).toBe("Updated Property");
  });

  it("should delete a property", async () => {
    const property: CreatePropertyDTO = {
      title: "Property 1",
      description: "Description 1333",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    const createdProperty = await propertyService.addProperty(property);
    await propertyService.deleteProperty({
      id: createdProperty.id,
    });
    const properties = await propertyService.getProperties();
    expect(properties).toHaveLength(0);
  });

  it("should get all properties", async () => {
    const property: CreatePropertyDTO = {
      title: "Property 1",
      description: "Description 1",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    const createdProperty = await propertyService.addProperty(property);
    const properties = await propertyService.getProperties();
    expect(properties).toHaveLength(1);
    expect(properties[0]).toEqual(
      expect.objectContaining({
        id: createdProperty.id, // Verifica o UUID gerado
        title: "Property 1",
        description: "Description 1",
        maxGuests: 1,
        basePricePerNight: 1,
        bookings: [],
      })
    );
  });

  it("should get property by id", async () => {
    const property: CreatePropertyDTO = {
      title: "Property 1",
      description: "Description 1",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    const createdProperty = await propertyService.addProperty(property);
    const foundProperty = await propertyService.getPropertyById(
      createdProperty.id
    );
    expect(foundProperty).toEqual(
      expect.objectContaining({
        id: createdProperty.id, // Verifica o UUID gerado
        title: "Property 1",
        description: "Description 1",
        maxGuests: 1,
        basePricePerNight: 1,
        bookings: [],
      })
    );
  });

  it("should return null if property not found by id", async () => {
    const foundProperty = await propertyService.getPropertyById("invalid-id");
    expect(foundProperty).toBeNull();
  });
});
