export interface MortgageParams {
  price: number;
  downPayment: number;
  rate: number;
  years: number;
}

export interface MortgageResult {
  monthly: number;
  principal: number;
  interestRate: number;
  downPayment: number;
  downPercent: number;
  totalPayment: number;
  totalInterest: number;
  payoffDate: string;
}

export function calculateMortgage({ price, downPayment, rate, years }: MortgageParams): MortgageResult {
  const principal = Math.max(0, price - downPayment);
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  const monthly =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = monthly * months;
  const now = new Date();
  const payoff = new Date(now.setFullYear(now.getFullYear() + years));

  return {
    monthly: Math.round(monthly),
    principal,
    interestRate: rate,
    downPayment,
    downPercent: price > 0 ? (downPayment / price) * 100 : 0,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalPayment - principal),
    payoffDate: payoff.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
}

export const DEFAULT_RATE = 6.5;
