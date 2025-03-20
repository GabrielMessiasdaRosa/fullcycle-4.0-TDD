import { CreateUserDTO } from "./create_user_dto";

export interface UpdateUserDTO extends CreateUserDTO {
  id: string;
}
