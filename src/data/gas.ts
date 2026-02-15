import { GasProvider } from "@/lib/types";

// Тарифи КЕВР (конвертирани в EUR, 1 EUR = 1.95583 BGN)
export const gasProviders: GasProvider[] = [
  {
    id: "overgas",
    name: "Овергаз Мрежи",
    region: "София и Югозападна България",
    coverageCities: [
      "София",
      "Перник",
      "Кюстендил",
      "Благоевград",
      "Дупница",
      "Банско",
      "Ботевград",
    ],
    pricePerM3: 0.5016,
    distributionFee: 0.0941,
    transmissionFee: 0.0215,
    excise: 0.0035,
    url: "https://www.overgas.bg",
  },
  {
    id: "citygas",
    name: "Ситигаз България",
    region: "Тракия",
    coverageCities: [
      "Пловдив",
      "Стара Загора",
      "Хасково",
      "Кърджали",
      "Пазарджик",
    ],
    pricePerM3: 0.5088,
    distributionFee: 0.1002,
    transmissionFee: 0.0215,
    excise: 0.0035,
    url: "https://www.citygas.bg",
  },
  {
    id: "chernomor",
    name: "Черноморска технологична компания",
    region: "Черноморие",
    coverageCities: ["Варна", "Бургас", "Добрич"],
    pricePerM3: 0.5175,
    distributionFee: 0.1048,
    transmissionFee: 0.0215,
    excise: 0.0035,
    url: "https://www.chtk.bg",
  },
  {
    id: "rilgas",
    name: "Рилгаз",
    region: "Западна България",
    coverageCities: ["Враца", "Монтана", "Видин"],
    pricePerM3: 0.5241,
    distributionFee: 0.1074,
    transmissionFee: 0.0215,
    excise: 0.0035,
  },
  {
    id: "sevliegas",
    name: "Севлиевогаз",
    region: "Централна България",
    coverageCities: ["Севлиево", "Габрово", "Велико Търново", "Ловеч"],
    pricePerM3: 0.5154,
    distributionFee: 0.1013,
    transmissionFee: 0.0215,
    excise: 0.0035,
  },
];

export const allGasCities = gasProviders.flatMap((p) =>
  p.coverageCities.map((city) => ({ city, providerId: p.id }))
);

export function getGasProviderByCity(
  city: string
): GasProvider | undefined {
  return gasProviders.find((p) => p.coverageCities.includes(city));
}
