import { FuelStation, FuelType } from "@/lib/types";

// Цени към февруари 2025 — актуализирай регулярно
export const fuelStations: FuelStation[] = [
  {
    id: "shell",
    chain: "shell",
    chainName: "Shell",
    prices: { A95: 2.55, A98: 2.75, diesel: 2.52, lpg: 1.35 },
    hasLoyalty: true,
    loyaltyDiscount: 3, // 3 ст./л с Shell ClubSmart
    stationCount: 115,
    url: "https://www.shell.bg",
  },
  {
    id: "omv",
    chain: "omv",
    chainName: "OMV",
    prices: { A95: 2.53, A98: 2.73, diesel: 2.50, lpg: 1.33 },
    hasLoyalty: true,
    loyaltyDiscount: 4, // 4 ст./л с OMV MOVE
    stationCount: 95,
    url: "https://www.omv.bg",
  },
  {
    id: "lukoil",
    chain: "lukoil",
    chainName: "Лукойл",
    prices: { A95: 2.49, A98: 2.69, diesel: 2.47, lpg: 1.30 },
    hasLoyalty: true,
    loyaltyDiscount: 3,
    stationCount: 210,
    url: "https://www.lukoil.bg",
  },
  {
    id: "eko",
    chain: "eko",
    chainName: "Еко",
    prices: { A95: 2.51, A98: 2.71, diesel: 2.49, lpg: 1.32 },
    hasLoyalty: true,
    loyaltyDiscount: 2,
    stationCount: 100,
    url: "https://www.eko.bg",
  },
  {
    id: "petrol",
    chain: "petrol",
    chainName: "Петрол",
    prices: { A95: 2.47, A98: null, diesel: 2.45, lpg: 1.28 },
    hasLoyalty: false,
    loyaltyDiscount: 0,
    stationCount: 300,
    url: "https://www.petrol.bg",
  },
  {
    id: "gazprom",
    chain: "gazprom",
    chainName: "NIS Петрол (Газпром)",
    prices: { A95: 2.48, A98: 2.68, diesel: 2.46, lpg: 1.29 },
    hasLoyalty: true,
    loyaltyDiscount: 2,
    stationCount: 75,
    url: "https://www.nispetrol.bg",
  },
];

export const fuelTypeLabels: Record<FuelType, string> = {
  A95: "Бензин A95",
  A98: "Бензин A98",
  diesel: "Дизел",
  lpg: "Автогаз (LPG)",
};
