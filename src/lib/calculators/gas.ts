import { GasProvider, GasResult, GasInput } from "@/lib/types";
import { gasProviders } from "@/data/gas";
import { addVat } from "@/lib/utils";

export function calculateGasBills(input: GasInput): GasResult[] {
  const results: GasResult[] = gasProviders.map((provider) => {
    const gasAmount = provider.pricePerM3 * input.consumptionM3;
    const distributionAmount = provider.distributionFee * input.consumptionM3;
    const transmissionAmount = provider.transmissionFee * input.consumptionM3;
    const exciseAmount = provider.excise * input.consumptionM3;
    const subtotal = gasAmount + distributionAmount + transmissionAmount + exciseAmount;
    const vat = subtotal * 0.2;
    const totalWithVat = Math.round(addVat(subtotal) * 100) / 100;

    return {
      provider,
      gasAmount: Math.round(gasAmount * 100) / 100,
      distributionAmount: Math.round(distributionAmount * 100) / 100,
      transmissionAmount: Math.round(transmissionAmount * 100) / 100,
      exciseAmount: Math.round(exciseAmount * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      totalWithVat,
      differenceFromCheapest: 0,
      isCheapest: false,
    };
  });

  results.sort((a, b) => a.totalWithVat - b.totalWithVat);

  if (results.length > 0) {
    const cheapest = results[0].totalWithVat;
    results[0].isCheapest = true;
    results.forEach((r) => {
      r.differenceFromCheapest = Math.round((r.totalWithVat - cheapest) * 100) / 100;
    });
  }

  return results;
}
