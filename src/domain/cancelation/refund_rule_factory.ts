import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund";
import { PartialRefund } from "./partial_refund";
import { RefundRule } from "./refund_rule.interface";

export class RefundRuleFactory {
  static getRefundRule(daysBeforeCheckIn: number): RefundRule {
    if (daysBeforeCheckIn <= 1 && daysBeforeCheckIn >= 0) {
      return new NoRefund();
    }

    if (daysBeforeCheckIn < 0) {
      return new NoRefund();
    }

    if (daysBeforeCheckIn <= 3) {
      return new PartialRefund();
    }

    if (daysBeforeCheckIn > 3) {
      return new FullRefund();
    }

    throw new Error("Invalid daysBeforeCheckIn");
  }
}
