import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund";
import { PartialRefund } from "./partial_refund";
import { RefundRuleFactory } from "./refund_rule_factory";

describe("RefundRuleFactory", () => {
  it("should return NoRefund when daysBeforeCheckIn is 1 or less", () => {
    expect(RefundRuleFactory.getRefundRule(1)).toBeInstanceOf(NoRefund);
    expect(RefundRuleFactory.getRefundRule(0)).toBeInstanceOf(NoRefund);
  });

  it("should return PartialRefund when daysBeforeCheckIn is between 2 and 3", () => {
    expect(RefundRuleFactory.getRefundRule(2)).toBeInstanceOf(PartialRefund);
    expect(RefundRuleFactory.getRefundRule(3)).toBeInstanceOf(PartialRefund);
  });

  it("should return FullRefund when daysBeforeCheckIn is more than 3", () => {
    expect(RefundRuleFactory.getRefundRule(4)).toBeInstanceOf(FullRefund);
    expect(RefundRuleFactory.getRefundRule(10)).toBeInstanceOf(FullRefund);
  });

  it("should return NoRefund when daysBeforeCheckIn is negative", () => {
    expect(RefundRuleFactory.getRefundRule(-1)).toBeInstanceOf(NoRefund);
  });

  it("should throw an error when daysBeforeCheckIn is invalid", () => {
    expect(() => RefundRuleFactory.getRefundRule(NaN)).toThrow(
      "Invalid daysBeforeCheckIn"
    );
  });
});
