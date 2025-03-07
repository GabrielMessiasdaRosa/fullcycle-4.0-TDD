import { DateRange } from "./date_range";
describe("DateRange Value Object", () => {
  it("deve criar uma instacia de DateRange com data de inicio e termino", () => {
    const startDate = new Date("2020-01-01");
    const endDate = new Date("2020-01-31");
    const dateRange = new DateRange(startDate, endDate);

    expect(dateRange.getStartDate()).toEqual(startDate);
    expect(dateRange.getEndDate()).toEqual(endDate);
  });
  it("deve lançar um erro se a data de termino for antes da data de inicio", () => {
    expect(() => {
      new DateRange(new Date("2020-01-01"), new Date("2019-01-01"));
    }).toThrow("A data de término deve ser posterior a data de início");
  });

  it("deve cakcular a diferença de dias entre a data de inicio e a data de termino", () => {
    const startDate = new Date("2020-01-01");
    const endDate = new Date("2020-01-31");
    const dateRange = new DateRange(startDate, endDate);
    const totalNight = dateRange.getTotalNights();
    expect(totalNight).toBe(30);
  });

  it("deve verificar se dois intervalos de datas se sobrepõem", () => {
    const dateRange1 = new DateRange(
      new Date("2020-01-01"),
      new Date("2020-01-31")
    );
    const dateRange2 = new DateRange(
      new Date("2020-01-15"),
      new Date("2020-02-15")
    );

    const overlaps = dateRange1.overlaps(dateRange2);
    expect(overlaps).toBe("UNAVAILABLE");
  });

  it("deve verificar se dois intervalos de datas não se sobrepõem", () => {
    const dateRange1 = new DateRange(
      new Date("2020-01-01"),
      new Date("2020-01-31")
    );
    const dateRange2 = new DateRange(
      new Date("2020-02-01"),
      new Date("2020-02-15")
    );

    const overlaps = dateRange1.overlaps(dateRange2);
    expect(overlaps).toBe("AVAILABLE");

    const overlaps2 = dateRange2.overlaps(dateRange1);
    expect(overlaps2).toBe("AVAILABLE");
  });

  it("deve verificar se a data de inicio é igual a data de termino", () => {
    const date = new Date("2020-01-01");
    expect(() => {
      new DateRange(date, date);
    }).toThrow("A data de término deve ser posterior a data de início");
  });
});
