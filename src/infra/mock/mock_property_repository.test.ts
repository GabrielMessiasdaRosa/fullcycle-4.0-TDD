import { Property } from "../../domain/entities/property";
import { MockPropertyRepository } from "./mock_property_repository";

describe("Mock Property Repository", () => {
  let repository: MockPropertyRepository;
  let property: Property;

  beforeEach(() => {
    repository = new MockPropertyRepository();
    property = new Property("1", "Property 1", "Description 1", 5, 100);
  });

  test("should add a property", async () => {
    await repository.addProperty(property);
    const properties = await repository.getProperties();
    expect(properties).toHaveLength(1);
    expect(properties[0]).toEqual(property);
  });

  test("should get all properties", async () => {
    await repository.addProperty(property);
    const properties = await repository.getProperties();
    expect(properties).toHaveLength(1);
    expect(properties[0]).toEqual(property);
  });

  test("should get property by id", async () => {
    await repository.addProperty(property);
    const foundProperty = await repository.getPropertyById("1");
    expect(foundProperty).toEqual(property);
  });

  test("should return null if property not found by id", async () => {
    const foundProperty = await repository.getPropertyById("2");
    expect(foundProperty).toBeNull();
  });

  test("should update a property", async () => {
    await repository.addProperty(property);
    await repository.updateProperty({ id: "1", title: "Updated Property" });
    const updatedProperty = await repository.getPropertyById("1");
    expect(updatedProperty?.title).toBe("Updated Property");
  });

  test("should delete a property", async () => {
    await repository.addProperty(property);
    await repository.deleteProperty("1");
    const properties = await repository.getProperties();
    expect(properties).toHaveLength(0);
  });
});
