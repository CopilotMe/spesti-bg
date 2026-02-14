import { ElectricityInput, ElectricityResult } from "@/lib/types";
import { electricityProviders } from "@/data/electricity";
import { VAT_RATE } from "@/lib/utils";

export function calculateElectricityBills(
  input: ElectricityInput
): ElectricityResult[] {
  const totalKwh = input.dayKwh + input.nightKwh;

  const results = electricityProviders.map((provider) => {
    let totalWithVat: number;

    if (input.meterType === "dual") {
      totalWithVat =
        input.dayKwh * provider.dayRate + input.nightKwh * provider.nightRate;
    } else {
      totalWithVat = totalKwh * provider.singleRate;
    }

    // Calculate breakdown (rates are without VAT)
    const breakdown = provider.breakdown.map((component) => ({
      component,
      amount: totalKwh * component.rate * (1 + VAT_RATE),
    }));

    return {
      provider,
      totalWithVat: Math.round(totalWithVat * 100) / 100,
      breakdown,
      differenceFromCheapest: 0,
      isCheapest: false,
    };
  });

  // Sort by total ascending
  results.sort((a, b) => a.totalWithVat - b.totalWithVat);

  // Mark cheapest and calculate differences
  const cheapestTotal = results[0].totalWithVat;
  results[0].isCheapest = true;

  for (const result of results) {
    result.differenceFromCheapest =
      Math.round((result.totalWithVat - cheapestTotal) * 100) / 100;
  }

  return results;
}
