import { Property } from "../entities/property";

export interface PropertyRepository {
  getProperties(): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | null>;
  addProperty(property: Property): Promise<void>;
  updateProperty(data: { id: string; title: string }): Promise<void>;
  deleteProperty(id: string): Promise<void>;
}
