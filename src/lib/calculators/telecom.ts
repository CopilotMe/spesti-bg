import { TelecomPlan, InternetPlan } from "@/lib/types";
import { mobilePlans, internetPlans } from "@/data/telecom";

export function filterMobilePlans(filters: {
  type?: "prepaid" | "postpaid" | "all";
  minDataGb?: number;
  operator?: string | "all";
}): TelecomPlan[] {
  let filtered = [...mobilePlans];

  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((p) => p.type === filters.type);
  }

  if (filters.minDataGb) {
    filtered = filtered.filter((p) => p.dataGb >= filters.minDataGb!);
  }

  if (filters.operator && filters.operator !== "all") {
    filtered = filtered.filter((p) => p.operator === filters.operator);
  }

  return filtered.sort((a, b) => a.monthlyFee - b.monthlyFee);
}

export function filterInternetPlans(filters: {
  minSpeedMbps?: number;
  provider?: string | "all";
}): InternetPlan[] {
  let filtered = [...internetPlans];

  if (filters.minSpeedMbps) {
    filtered = filtered.filter((p) => p.speedMbps >= filters.minSpeedMbps!);
  }

  if (filters.provider && filters.provider !== "all") {
    filtered = filtered.filter((p) => p.provider === filters.provider);
  }

  return filtered.sort((a, b) => a.monthlyFee - b.monthlyFee);
}
