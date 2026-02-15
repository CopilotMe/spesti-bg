import { FuelStation, FuelType } from "@/lib/types";

// Цени към февруари 2025 (конвертирани в EUR, 1 EUR = 1.95583 BGN)
export const fuelStations: FuelStation[] = [
  {
    id: "shell",
    chain: "shell",
    chainName: "Shell",
    prices: { A95: 1.30, A98: 1.41, diesel: 1.29, lpg: 0.69 },
    hasLoyalty: true,
    loyaltyDiscount: 1.5, // ~1.5 цент/л с Shell ClubSmart
    stationCount: 115,
    url: "https://www.shell.bg",
  },
  {
    id: "omv",
    chain: "omv",
    chainName: "OMV",
    prices: { A95: 1.29, A98: 1.40, diesel: 1.28, lpg: 0.68 },
    hasLoyalty: true,
    loyaltyDiscount: 2, // ~2 цент/л с OMV MOVE
    stationCount: 95,
    url: "https://www.omv.bg",
  },
  {
    id: "lukoil",
    chain: "lukoil",
    chainName: "Лукойл",
    prices: { A95: 1.27, A98: 1.38, diesel: 1.26, lpg: 0.66 },
    hasLoyalty: true,
    loyaltyDiscount: 1.5,
    stationCount: 210,
    url: "https://www.lukoil.bg",
  },
  {
    id: "eko",
    chain: "eko",
    chainName: "Еко",
    prices: { A95: 1.28, A98: 1.39, diesel: 1.27, lpg: 0.67 },
    hasLoyalty: true,
    loyaltyDiscount: 1,
    stationCount: 100,
    url: "https://www.eko.bg",
  },
  {
    id: "petrol",
    chain: "petrol",
    chainName: "Петрол",
    prices: { A95: 1.26, A98: null, diesel: 1.25, lpg: 0.65 },
    hasLoyalty: false,
    loyaltyDiscount: 0,
    stationCount: 300,
    url: "https://www.petrol.bg",
  },
  {
    id: "gazprom",
    chain: "gazprom",
    chainName: "NIS Петрол (Газпром)",
    prices: { A95: 1.27, A98: 1.37, diesel: 1.26, lpg: 0.66 },
    hasLoyalty: true,
    loyaltyDiscount: 1,
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
