import { v4 as uuidv4 } from "uuid";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { CreatePropertyDTO } from "../dtos/property/create_property_dto";
import { DeletePropertyDTO } from "../dtos/property/delete_property_dto";
import { Property } from "./../../domain/entities/property";
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
    title,
    description,
    basePricePerNight,
    maxGuests,
  }: CreatePropertyDTO): Promise<Property> {
    const id = uuidv4();
    const newProperty = new Property(
      id,
      title,
      description,
      basePricePerNight,
      maxGuests
    );
    const response = await this.propertyRepository.addProperty(newProperty);
    return response;
  }

  async updateProperty(data: { id: string; title: string }): Promise<Property> {
    const updatedProperty = await this.propertyRepository.updateProperty(data);
    return updatedProperty;
  }

  async deleteProperty({ id }: DeletePropertyDTO): Promise<void> {
    const deletedProperty = await this.propertyRepository.deleteProperty(id);
    return deletedProperty;
  }
}
