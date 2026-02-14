import { ElectricityProvider } from "@/lib/types";

export const electricityProviders: ElectricityProvider[] = [
  {
    id: "electrohold",
    name: "Електрохолд (бивш ЧЕЗ)",
    region: "Западна България",
    coverageAreas: [
      "София-град",
      "София-област",
      "Перник",
      "Кюстендил",
      "Благоевград",
      "Враца",
      "Монтана",
      "Видин",
      "Плевен",
      "Ловеч",
    ],
    dayRate: 0.2657,
    nightRate: 0.141,
    singleRate: 0.2657,
    breakdown: [
      {
        id: "energy",
        name: "Електрическа енергия",
        rate: 0.11,
        explanationKey: "energy",
      },
      {
        id: "transmission",
        name: "Пренос (ЕСО)",
        rate: 0.0178,
        explanationKey: "transmission",
      },
      {
        id: "distribution",
        name: "Разпределение",
        rate: 0.0472,
        explanationKey: "distribution",
      },
      {
        id: "distribution_access",
        name: "Достъп до мрежата",
        rate: 0.016,
        explanationKey: "distribution_access",
      },
      {
        id: "public_obligation",
        name: "Задължение към обществото",
        rate: 0.0284,
        explanationKey: "public_obligation",
      },
      {
        id: "excise",
        name: "Акциз",
        rate: 0.002,
        explanationKey: "excise",
      },
    ],
  },
  {
    id: "evn",
    name: "EVN",
    region: "Южна България",
    coverageAreas: [
      "Пловдив",
      "Стара Загора",
      "Бургас",
      "Хасково",
      "Кърджали",
      "Смолян",
      "Пазарджик",
      "Сливен",
      "Ямбол",
    ],
    dayRate: 0.2719,
    nightRate: 0.1472,
    singleRate: 0.2719,
    breakdown: [
      {
        id: "energy",
        name: "Електрическа енергия",
        rate: 0.115,
        explanationKey: "energy",
      },
      {
        id: "transmission",
        name: "Пренос (ЕСО)",
        rate: 0.0178,
        explanationKey: "transmission",
      },
      {
        id: "distribution",
        name: "Разпределение",
        rate: 0.0489,
        explanationKey: "distribution",
      },
      {
        id: "distribution_access",
        name: "Достъп до мрежата",
        rate: 0.0148,
        explanationKey: "distribution_access",
      },
      {
        id: "public_obligation",
        name: "Задължение към обществото",
        rate: 0.0281,
        explanationKey: "public_obligation",
      },
      {
        id: "excise",
        name: "Акциз",
        rate: 0.002,
        explanationKey: "excise",
      },
    ],
  },
  {
    id: "energo_pro",
    name: "Енерго-Про",
    region: "Североизточна България",
    coverageAreas: [
      "Варна",
      "Русе",
      "Добрич",
      "Шумен",
      "Търговище",
      "Разград",
      "Силистра",
      "Велико Търново",
      "Габрово",
    ],
    dayRate: 0.2772,
    nightRate: 0.1512,
    singleRate: 0.2772,
    breakdown: [
      {
        id: "energy",
        name: "Електрическа енергия",
        rate: 0.117,
        explanationKey: "energy",
      },
      {
        id: "transmission",
        name: "Пренос (ЕСО)",
        rate: 0.0178,
        explanationKey: "transmission",
      },
      {
        id: "distribution",
        name: "Разпределение",
        rate: 0.051,
        explanationKey: "distribution",
      },
      {
        id: "distribution_access",
        name: "Достъп до мрежата",
        rate: 0.0152,
        explanationKey: "distribution_access",
      },
      {
        id: "public_obligation",
        name: "Задължение към обществото",
        rate: 0.028,
        explanationKey: "public_obligation",
      },
      {
        id: "excise",
        name: "Акциз",
        rate: 0.002,
        explanationKey: "excise",
      },
    ],
  },
];

export const allCoverageAreas = electricityProviders.flatMap((p) =>
  p.coverageAreas.map((area) => ({ area, providerId: p.id }))
);

export function getProviderByArea(
  area: string
): ElectricityProvider | undefined {
  return electricityProviders.find((p) => p.coverageAreas.includes(area));
}
