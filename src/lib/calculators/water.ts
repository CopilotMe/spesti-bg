import { WaterInput, WaterResult } from "@/lib/types";
import { waterProviders } from "@/data/water";
import { VAT_RATE } from "@/lib/utils";

export function calculateWaterBills(input: WaterInput): WaterResult[] {
  const m3 = input.consumptionM3;

  const results = waterProviders.map((provider) => {
    const supplyAmount = m3 * provider.supplyRate;
    const sewerageAmount = m3 * provider.sewerageRate;
    const treatmentAmount = m3 * provider.treatmentRate;
    const subtotal = supplyAmount + sewerageAmount + treatmentAmount;
    const vat = subtotal * VAT_RATE;
    const totalWithVat = Math.round((subtotal + vat) * 100) / 100;

    return {
      provider,
      supplyAmount: Math.round(supplyAmount * 100) / 100,
      sewerageAmount: Math.round(sewerageAmount * 100) / 100,
      treatmentAmount: Math.round(treatmentAmount * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      totalWithVat,
      differenceFromCheapest: 0,
      isCheapest: false,
    };
  });

  results.sort((a, b) => a.totalWithVat - b.totalWithVat);

  const cheapestTotal = results[0].totalWithVat;
  results[0].isCheapest = true;

  for (const result of results) {
    result.differenceFromCheapest =
      Math.round((result.totalWithVat - cheapestTotal) * 100) / 100;
  }

  return results;
}
