import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async getProperties(): Promise<Property[]> {
    const properties = await this.propertyRepository.getProperties();
    return properties;
  }

  async getPropertyById(id: string): Promise<Property | null> {
    const property = await this.propertyRepository.getPropertyById(id);
    return property;
  }
  async addProperty({
    id,
    title,
    description,
    basePricePerNight,
    maxGuests,
  }: {
    id: string;
    title: string;
    description: string;
    basePricePerNight: number;
    maxGuests: number;
  }): Promise<void> {
    const newProperty = new Property(
      id,
      title,
      description,
      basePricePerNight,
      maxGuests
    );
    await this.propertyRepository.addProperty(newProperty);
  }

  async updateProperty(data: { id: string; title: string }): Promise<void> {
    await this.propertyRepository.updateProperty(data);
  }

  async deleteProperty(id: string): Promise<void> {
    await this.propertyRepository.deleteProperty(id);
  }
}
