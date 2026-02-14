import { GasProvider } from "@/lib/types";

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
    pricePerM3: 0.981,
    distributionFee: 0.184,
    transmissionFee: 0.042,
    excise: 0.0069,
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
    pricePerM3: 0.995,
    distributionFee: 0.196,
    transmissionFee: 0.042,
    excise: 0.0069,
    url: "https://www.citygas.bg",
  },
  {
    id: "chernomor",
    name: "Черноморска технологична компания",
    region: "Черноморие",
    coverageCities: ["Варна", "Бургас", "Добрич"],
    pricePerM3: 1.012,
    distributionFee: 0.205,
    transmissionFee: 0.042,
    excise: 0.0069,
    url: "https://www.chtk.bg",
  },
  {
    id: "rilgas",
    name: "Рилгаз",
    region: "Западна България",
    coverageCities: ["Враца", "Монтана", "Видин"],
    pricePerM3: 1.025,
    distributionFee: 0.21,
    transmissionFee: 0.042,
    excise: 0.0069,
  },
  {
    id: "sevliegas",
    name: "Севлиевогаз",
    region: "Централна България",
    coverageCities: ["Севлиево", "Габрово", "Велико Търново", "Ловеч"],
    pricePerM3: 1.008,
    distributionFee: 0.198,
    transmissionFee: 0.042,
    excise: 0.0069,
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
