import { User } from "../../../domain/entities/user";
import { UserEntity } from "../entity/user_entity";
import { UserMapper } from "./user_mapper";

describe("UserMapper", () => {
  describe("toDomain", () => {
    it("should map a UserEntity to a User domain object", () => {
      const userEntity = new UserEntity();
      userEntity.id = "123";
      userEntity.name = "John Doe";

      const user = UserMapper.toDomain(userEntity);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe("123");
      expect(user.name).toBe("John Doe");
    });
  });

  describe("toPersistence", () => {
    it("should map a User domain object to a UserEntity", () => {
      const user = new User("123", "John Doe");

      const userEntity = UserMapper.toPersistence(user);

      expect(userEntity).toBeInstanceOf(UserEntity);
      expect(userEntity.id).toBe("123");
      expect(userEntity.name).toBe("John Doe");
    });
  });
});
