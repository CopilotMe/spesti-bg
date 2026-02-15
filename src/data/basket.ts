import type { BasketProduct, BasketHistoryPoint } from "@/lib/types";

// Малка потребителска кошница — 21 продукта, наблюдавани от КНСБ
// Цени в EUR, актуални към февруари 2026 г.
// Източник: КНСБ ежемесечно наблюдение на цените в 600+ магазина в 81 общини

export const basketProducts: BasketProduct[] = [
  // Хляб и зърнени
  { id: "bread-white", name: "Хляб бял", category: "bread", unit: "бр (0.65 кг)", priceEur: 0.77, previousPriceEur: 0.74 },
  { id: "bread-type", name: "Хляб типов", category: "bread", unit: "бр (0.65 кг)", priceEur: 0.92, previousPriceEur: 0.88 },
  { id: "flour", name: "Брашно", category: "bread", unit: "кг", priceEur: 0.72, previousPriceEur: 0.65 },
  { id: "rice", name: "Ориз", category: "bread", unit: "кг", priceEur: 1.76, previousPriceEur: 1.60 },
  // Млечни
  { id: "fresh-milk", name: "Прясно мляко", category: "dairy", unit: "л", priceEur: 1.20, previousPriceEur: 1.18 },
  { id: "sour-milk", name: "Кисело мляко", category: "dairy", unit: "400 г", priceEur: 0.67, previousPriceEur: 0.74 },
  { id: "white-cheese", name: "Сирене", category: "dairy", unit: "кг", priceEur: 6.26, previousPriceEur: 6.00 },
  { id: "kashkaval", name: "Кашкавал", category: "dairy", unit: "кг", priceEur: 9.60, previousPriceEur: 9.46 },
  { id: "butter", name: "Масло", category: "dairy", unit: "125 г", priceEur: 1.63, previousPriceEur: 1.53 },
  { id: "eggs", name: "Яйца", category: "dairy", unit: "бр", priceEur: 0.22, previousPriceEur: 0.21 },
  // Месо
  { id: "chicken", name: "Пилешко месо", category: "meat", unit: "кг", priceEur: 3.54, previousPriceEur: 3.52 },
  { id: "pork", name: "Свинско месо", category: "meat", unit: "кг", priceEur: 5.10, previousPriceEur: 4.95 },
  { id: "sausage", name: "Кренвирши", category: "meat", unit: "кг", priceEur: 3.80, previousPriceEur: 3.70 },
  // Олио
  { id: "sunflower-oil", name: "Слънчогледово олио", category: "oil", unit: "л", priceEur: 1.63, previousPriceEur: 1.53 },
  { id: "sugar", name: "Захар", category: "oil", unit: "кг", priceEur: 0.92, previousPriceEur: 0.90 },
  // Зеленчуци
  { id: "tomatoes", name: "Домати", category: "vegetables", unit: "кг", priceEur: 2.30, previousPriceEur: 2.00 },
  { id: "cucumbers", name: "Краставици", category: "vegetables", unit: "кг", priceEur: 2.15, previousPriceEur: 1.90 },
  { id: "potatoes", name: "Картофи", category: "vegetables", unit: "кг", priceEur: 0.82, previousPriceEur: 0.78 },
  // Плодове
  { id: "apples", name: "Ябълки", category: "vegetables", unit: "кг", priceEur: 1.28, previousPriceEur: 1.25 },
  { id: "bananas", name: "Банани", category: "fruits", unit: "кг", priceEur: 1.15, previousPriceEur: 1.12 },
  // Друго
  { id: "gasoline-a95", name: "Бензин А95", category: "other", unit: "л", priceEur: 1.30, previousPriceEur: 1.28 },
];

// Обща стойност на кошницата
export const currentBasketTotal = basketProducts.reduce((sum, p) => sum + p.priceEur, 0);

// Историческа стойност на кошницата (месечни данни от юни 2025 до февруари 2026)
// Стойностите до декември 2025 са конвертирани от BGN (÷ 1.95583)
export const basketHistory: BasketHistoryPoint[] = [
  { month: "2025-06", totalEur: 49.20 },
  { month: "2025-07", totalEur: 49.80 },
  { month: "2025-08", totalEur: 50.30 },
  { month: "2025-09", totalEur: 50.90 },
  { month: "2025-10", totalEur: 51.40 },
  { month: "2025-11", totalEur: 51.80 },
  { month: "2025-12", totalEur: 52.10 },
  { month: "2026-01", totalEur: 57.00 },
  { month: "2026-02", totalEur: currentBasketTotal },
];

// Минимална работна заплата в EUR
export const minimumWageEur = 620.20;

// Категории на продуктите
export const categoryLabels: Record<BasketProduct["category"], string> = {
  bread: "Хляб и зърнени",
  dairy: "Млечни продукти",
  meat: "Месо и колбаси",
  oil: "Олио и захар",
  vegetables: "Зеленчуци",
  fruits: "Плодове",
  other: "Други",
};

// Дата на последна актуализация
export const basketLastUpdated = "2026-02-09";
export const basketDataSource = "КНСБ";
export const basketUpdateFrequency = "ежемесечно";
