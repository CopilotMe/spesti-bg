import { ElectricityProvider } from "@/lib/types";

// Тарифи КЕВР юли 2025 – юни 2026 (конвертирани в EUR, 1 EUR = 1.95583 BGN)
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
    dayRate: 0.1359,
    nightRate: 0.0721,
    singleRate: 0.1359,
    breakdown: [
      {
        id: "energy",
        name: "Електрическа енергия",
        rate: 0.0563,
        explanationKey: "energy",
      },
      {
        id: "transmission",
        name: "Пренос (ЕСО)",
        rate: 0.0091,
        explanationKey: "transmission",
      },
      {
        id: "distribution",
        name: "Разпределение",
        rate: 0.0241,
        explanationKey: "distribution",
      },
      {
        id: "distribution_access",
        name: "Достъп до мрежата",
        rate: 0.0082,
        explanationKey: "distribution_access",
      },
      {
        id: "public_obligation",
        name: "Задължение към обществото",
        rate: 0.0145,
        explanationKey: "public_obligation",
      },
      {
        id: "excise",
        name: "Акциз",
        rate: 0.001,
        explanationKey: "excise",
      },
    ],
    url: "https://www.electrohold.bg",
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
    dayRate: 0.1390,
    nightRate: 0.0753,
    singleRate: 0.1390,
    breakdown: [
      {
        id: "energy",
        name: "Електрическа енергия",
        rate: 0.0588,
        explanationKey: "energy",
      },
      {
        id: "transmission",
        name: "Пренос (ЕСО)",
        rate: 0.0091,
        explanationKey: "transmission",
      },
      {
        id: "distribution",
        name: "Разпределение",
        rate: 0.0250,
        explanationKey: "distribution",
      },
      {
        id: "distribution_access",
        name: "Достъп до мрежата",
        rate: 0.0076,
        explanationKey: "distribution_access",
      },
      {
        id: "public_obligation",
        name: "Задължение към обществото",
        rate: 0.0144,
        explanationKey: "public_obligation",
      },
      {
        id: "excise",
        name: "Акциз",
        rate: 0.001,
        explanationKey: "excise",
      },
    ],
    url: "https://www.evn.bg",
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
    dayRate: 0.1417,
    nightRate: 0.0773,
    singleRate: 0.1417,
    breakdown: [
      {
        id: "energy",
        name: "Електрическа енергия",
        rate: 0.0598,
        explanationKey: "energy",
      },
      {
        id: "transmission",
        name: "Пренос (ЕСО)",
        rate: 0.0091,
        explanationKey: "transmission",
      },
      {
        id: "distribution",
        name: "Разпределение",
        rate: 0.0261,
        explanationKey: "distribution",
      },
      {
        id: "distribution_access",
        name: "Достъп до мрежата",
        rate: 0.0078,
        explanationKey: "distribution_access",
      },
      {
        id: "public_obligation",
        name: "Задължение към обществото",
        rate: 0.0143,
        explanationKey: "public_obligation",
      },
      {
        id: "excise",
        name: "Акциз",
        rate: 0.001,
        explanationKey: "excise",
      },
    ],
    url: "https://www.energo-pro.bg",
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
