import { Metadata } from "next";
import { BasketDashboard } from "@/components/calculator/BasketDashboard";

export const metadata: Metadata = {
  title: "Малка потребителска кошница – Цени на 21 основни продукта",
  description:
    "Актуални цени на 21 продукта от малката потребителска кошница в България. Данни от КНСБ, ежемесечно обновяване. Сравни с минималната заплата и виж инфлацията на храните.",
  alternates: { canonical: "/koshnitsa" },
};

export default function BasketPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Малка потребителска кошница
        </h1>
        <p className="mt-2 text-muted">
          Актуални цени на 21 основни продукта, наблюдавани ежемесечно от КНСБ
          в 600+ магазина из цялата страна. Виж как се променят цените и колко
          пъти можеш да си купиш кошницата с минимална заплата.
        </p>
      </div>
      <BasketDashboard />
    </div>
  );
}
