import { Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { PropertyEntity } from "../persistence/entity/property_entity";
import { PropertyMapper } from "../persistence/mappers/property_mapper";

export class TypeORMPropertyRepository implements PropertyRepository {
  private propertyRepository: Repository<PropertyEntity>;

  constructor(propertyRepository: Repository<PropertyEntity>) {
    this.propertyRepository = propertyRepository;
  }

  async addProperty(property: Property): Promise<Property> {
    const propertyEntity = PropertyMapper.toPersistence(property);
    await this.propertyRepository.save(propertyEntity);
    return property;
  }

  async getPropertyById(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ["bookings"],
    });
    if (!property) {
      throw new Error("Property not found");
    }
    const mappedProperty = PropertyMapper.toDomain(property);
    return mappedProperty;
  }

  async getProperties(): Promise<Property[]> {
    const properties = await this.propertyRepository.find();
    const mappedProperties = properties.map((property) =>
      PropertyMapper.toDomain(property)
    );
    return mappedProperties;
  }

  async updateProperty(property: Property): Promise<Property> {
    await this.propertyRepository.update(property.getId(), {
      title: property.getTitle(),
      description: property.getDescription(),
      maxGuests: property.getMaxGuests(),
      basePricePerNight: property.getBasePricePerNight(),
    });
    const mappedProperty = PropertyMapper.toDomain(property);
    return mappedProperty;
  }

  async deleteProperty(id: string): Promise<void> {
    await this.propertyRepository.delete(id);
  }
}
