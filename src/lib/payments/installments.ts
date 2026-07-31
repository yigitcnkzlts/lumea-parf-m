export interface InstallmentPlan {
  count: number;
  label: string;
  /** Extra percent over cash total (0 = vade farksız) */
  interestRatePercent: number;
}

export interface InstallmentQuote {
  count: number;
  label: string;
  interestRatePercent: number;
  cashTotal: number;
  interestAmount: number;
  payableTotal: number;
  monthlyAmount: number;
  isInterestFree: boolean;
}

/** Default Bee plans — rates adjustable via INSTALLMENT_PLAN_RATES env */
export const DEFAULT_INSTALLMENT_PLANS: InstallmentPlan[] = [
  { count: 1, label: "Peşin", interestRatePercent: 0 },
  { count: 2, label: "2 Taksit", interestRatePercent: 0 },
  { count: 3, label: "3 Taksit", interestRatePercent: 0 },
  { count: 6, label: "6 Taksit", interestRatePercent: 4.5 },
  { count: 9, label: "9 Taksit", interestRatePercent: 7.5 },
];

/**
 * Parse env like: 1:0,2:0,3:0,6:4.5,9:7.5
 * Falls back to defaults.
 */
export function getInstallmentPlans(): InstallmentPlan[] {
  const raw = process.env.NEXT_PUBLIC_INSTALLMENT_PLAN_RATES?.trim()
    || process.env.INSTALLMENT_PLAN_RATES?.trim();
  if (!raw) return DEFAULT_INSTALLMENT_PLANS;

  const parsed: InstallmentPlan[] = [];
  for (const part of raw.split(",")) {
    const [countRaw, rateRaw] = part.split(":").map((s) => s.trim());
    const count = Number(countRaw);
    const interestRatePercent = Number(rateRaw);
    if (!Number.isFinite(count) || count < 1 || !Number.isFinite(interestRatePercent)) continue;
    parsed.push({
      count,
      label: count === 1 ? "Peşin" : `${count} Taksit`,
      interestRatePercent,
    });
  }
  return parsed.length ? parsed.sort((a, b) => a.count - b.count) : DEFAULT_INSTALLMENT_PLANS;
}

export function quoteInstallment(cashTotal: number, plan: InstallmentPlan): InstallmentQuote {
  const interestAmount = Math.round(cashTotal * (plan.interestRatePercent / 100));
  const payableTotal = cashTotal + interestAmount;
  const monthlyAmount = Math.ceil(payableTotal / plan.count);
  return {
    count: plan.count,
    label: plan.label,
    interestRatePercent: plan.interestRatePercent,
    cashTotal,
    interestAmount,
    payableTotal,
    monthlyAmount,
    isInterestFree: plan.interestRatePercent <= 0,
  };
}

export function quoteAllInstallments(cashTotal: number, plans = getInstallmentPlans()) {
  return plans.map((plan) => quoteInstallment(cashTotal, plan));
}

export function enabledInstallmentCounts(plans = getInstallmentPlans()) {
  return plans.map((p) => p.count);
}
