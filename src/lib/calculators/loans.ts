import { LoanProduct, LoanResult, LoanInput } from "@/lib/types";
import { loanProducts } from "@/data/loans";

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function calculateLoans(input: LoanInput): LoanResult[] {
  const filtered = loanProducts.filter(
    (p) =>
      p.type === input.type &&
      input.amount >= p.minAmount &&
      input.amount <= p.maxAmount &&
      input.termMonths >= p.minTermMonths &&
      input.termMonths <= p.maxTermMonths
  );

  const results: LoanResult[] = filtered.map((product) => {
    const monthlyPayment = calculateMonthlyPayment(
      input.amount,
      product.interestRate,
      input.termMonths
    );
    const totalPayment = monthlyPayment * input.termMonths;
    const totalInterest = totalPayment - input.amount;

    return {
      product,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      differenceFromCheapest: 0,
      isCheapest: false,
    };
  });

  results.sort((a, b) => a.monthlyPayment - b.monthlyPayment);

  if (results.length > 0) {
    const cheapest = results[0].totalInterest;
    results[0].isCheapest = true;
    results.forEach((r) => {
      r.differenceFromCheapest =
        Math.round((r.totalInterest - cheapest) * 100) / 100;
    });
  }

  return results;
}
