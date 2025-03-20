import { CreatePropertyDTO } from "./create_property_dto";

export interface UpdatePropertyDTO extends CreatePropertyDTO {
  id: string;
}
