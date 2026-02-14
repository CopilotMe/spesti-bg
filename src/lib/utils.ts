export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} лв.`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export const VAT_RATE = 0.2;

export function addVat(amount: number): number {
  return amount * (1 + VAT_RATE);
}
