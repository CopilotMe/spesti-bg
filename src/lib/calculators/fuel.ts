import { FuelInput, FuelResult } from "@/lib/types";
import { fuelStations } from "@/data/fuel";

export function calculateFuelCosts(input: FuelInput): FuelResult[] {
  const results: FuelResult[] = [];

  for (const station of fuelStations) {
    const price = station.prices[input.fuelType];
    if (price === null) continue; // station doesn't sell this fuel type

    const monthlyCost = price * input.monthlyLiters;
    const yearlyCost = monthlyCost * 12;

    results.push({
      station,
      pricePerLiter: price,
      monthlyCost,
      yearlyCost,
      differenceFromCheapest: 0,
      isCheapest: false,
    });
  }

  results.sort((a, b) => a.pricePerLiter - b.pricePerLiter);

  if (results.length > 0) {
    const cheapest = results[0].monthlyCost;
    results[0].isCheapest = true;
    for (const r of results) {
      r.differenceFromCheapest = r.monthlyCost - cheapest;
    }
  }

  return results;
}
