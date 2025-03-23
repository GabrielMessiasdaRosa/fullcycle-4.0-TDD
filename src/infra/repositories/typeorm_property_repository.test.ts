import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { BookingEntity } from "../persistence/entity/booking_entity";
import { UserEntity } from "../persistence/entity/user_entity";
import { PropertyEntity } from "./../persistence/entity/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";

describe("TypeORMPropertyRepository", () => {
  let dataSource: DataSource;
  let propertyRepository: TypeORMPropertyRepository;
  let repository: Repository<PropertyEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [PropertyEntity, UserEntity, BookingEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve salvar uma propriedade", async () => {
    const property = new Property("321", "Casa", "Casa de campo", 10, 250);
    await propertyRepository.addProperty(property);
    const savedProperty = await propertyRepository.getPropertyById("321");
    const properties = await propertyRepository.getProperties();

    expect(savedProperty).toEqual(property);
    expect(properties).toContainEqual(property);
  });

  it("deve deletar uma propriedade", async () => {
    const property = new Property(
      "123",
      "Apartamento",
      "Apartamento no centro",
      5,
      120
    );
    await propertyRepository.addProperty(property);

    await propertyRepository.deleteProperty("123");
    const properties = await propertyRepository.getProperties();

    expect(properties).not.toContainEqual(property);
  });

  it("deve lançar um erro ao tentar deletar uma propriedade inexistente", async () => {
    await expect(
      propertyRepository.deleteProperty("999")
    ).resolves.not.toThrow();
    const properties = await propertyRepository.getProperties();

    expect(properties).not.toContainEqual(
      expect.objectContaining({ id: "999" })
    );
  });

  it("deve atualizar uma propriedade", async () => {
    const property = new Property(
      "456",
      "Chácara",
      "Chácara com piscina",
      15,
      500
    );
    await propertyRepository.addProperty(property);

    const updatedProperty = new Property(
      "456",
      "Chácara",
      "Chácara reformada",
      20,
      600
    );
    const result = await propertyRepository.updateProperty(updatedProperty);

    const fetchedProperty = await propertyRepository.getPropertyById("456");
    expect(result).toEqual(updatedProperty);
    expect(fetchedProperty).toEqual(updatedProperty);
  });

  it("deve lançar um erro ao tentar buscar uma propriedade inexistente", async () => {
    await expect(
      propertyRepository.getPropertyById("94984984948984984")
    ).rejects.toThrow();
  });
});
