import { Property } from "../domain/entities/property";
import { PropertyRepository } from "../domain/repositories/property_repository";

export class MockPropertyRepository implements PropertyRepository {
  private properties: Property[];
  constructor() {
    this.properties = [];
  }

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

  async addProperty(property: Property): Promise<void> {
    this.properties.push(property);
  }

  async updateProperty(data: { id: string; title: string }): Promise<void> {
    this.properties.forEach((property) => {
      if (property.id === data.id) {
        property.title = data.title;
      }
    });
  }

  async deleteProperty(id: string): Promise<void> {
    this.properties = this.properties.filter((property) => property.id !== id);
  }
}
