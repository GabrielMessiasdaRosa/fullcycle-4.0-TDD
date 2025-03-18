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
    const property = {
      id: "1",
      title: "Property 1",
      description: "Description 1",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    await propertyService.addProperty(property);
    const properties = await propertyService.getProperties();
    expect(properties).toEqual([
      expect.objectContaining({
        id: "1",
        title: "Property 1",
        description: "Description 1",
        maxGuests: 1,
        basePricePerNight: 1,
        bookings: [],
      }),
    ]);
  });

  it("should update a property", async () => {
    const property = {
      id: "1",
      title: "Property 1",
      description: "Description 1",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    await propertyService.addProperty(property);
    await propertyService.updateProperty({
      id: "1",
      title: "Updated Property",
    });
    const updatedProperty = await propertyService.getPropertyById("1");
    expect(updatedProperty?.title).toBe("Updated Property");
  });

  it("should delete a property", async () => {
    const property = {
      id: "1",
      title: "Property 1",
      description: "Description 1",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    await propertyService.addProperty(property);
    await propertyService.deleteProperty("1");
    const properties = await propertyService.getProperties();
    expect(properties).toHaveLength(0);
  });

  it("should get all properties", async () => {
    const property = {
      id: "1",
      title: "Property 1",
      description: "Description 1",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    await propertyService.addProperty(property);
    const properties = await propertyService.getProperties();
    expect(properties).toHaveLength(1);
    expect(properties[0]).toEqual(
      expect.objectContaining({
        id: "1",
        title: "Property 1",
        description: "Description 1",
        maxGuests: 1,
        basePricePerNight: 1,
        bookings: [],
      })
    );
  });

  it("should get property by id", async () => {
    const property = {
      id: "1",
      title: "Property 1",
      description: "Description 1",
      maxGuests: 1,
      basePricePerNight: 1,
    };
    await propertyService.addProperty(property);
    const foundProperty = await propertyService.getPropertyById("1");
    expect(foundProperty).toEqual(
      expect.objectContaining({
        id: "1",
        title: "Property 1",
        description: "Description 1",
        maxGuests: 1,
        basePricePerNight: 1,
        bookings: [],
      })
    );
  });

  it("should return null if property not found by id", async () => {
    const foundProperty = await propertyService.getPropertyById("2");
    expect(foundProperty).toBeNull();
  });
});
