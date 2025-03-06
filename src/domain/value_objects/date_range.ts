const ONE_DAY = 1000 * 60 * 60 * 24;

export class DateRange {
  private startDate: Date;
  private endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.validateDates(startDate, endDate);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  private validateDates(startDate: Date, endDate: Date) {
    if (startDate == endDate) {
      throw new Error("A data de término deve ser posterior a data de início");
    }

    if (endDate < startDate) {
      throw new Error("A data de término deve ser posterior a data de início");
    }
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getTotalNights(): number {
    const diffTime = Math.abs(
      this.endDate.getTime() - this.startDate.getTime()
    );
    const diffDays = Math.ceil(diffTime / ONE_DAY);
    return diffDays;
  }

  overlaps(dateRange: DateRange): boolean {
    return (
      this.startDate <= dateRange.getEndDate() &&
      this.endDate >= dateRange.getStartDate()
    );
  }
}
