import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";

export class MockPropertyRepository implements PropertyRepository {
  private properties: Property[] = [];

  async getProperties(): Promise<Property[]> {
    return this.properties;
  }

  async getPropertyById(id: string): Promise<Property | null> {
    const property = this.properties.find((property) => property.id === id);
    if (!property?.id) {
      return null;
    }
    return property;
  }

  async addProperty(property: Property): Promise<Property> {
    this.properties.push(property);
    return property;
  }

  async updateProperty(data: { id: string; title: string }): Promise<Property> {
    this.properties.forEach((property) => {
      if (property.id === data.id) {
        property.title = data.title;
      }
    });
    return this.properties.find(
      (property) => property.id === data.id
    ) as Property;
  }

  async deleteProperty(id: string): Promise<void> {
    this.properties = this.properties.filter((property) => property.id !== id);
  }
}
