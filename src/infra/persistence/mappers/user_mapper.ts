import { User } from "../../../domain/entities/user";
import { UserEntity } from "../entity/user_entity";

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const domain = new User(entity.id, entity.name);
    return domain;
  }

  static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    return entity;
  }
}
