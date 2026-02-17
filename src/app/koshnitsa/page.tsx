import { Metadata } from "next";
import dynamic from "next/dynamic";

const BasketDashboard = dynamic(
  () => import("@/components/calculator/BasketDashboard").then((m) => m.BasketDashboard),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане на данни от КНСБ...</span>
      </div>
    ),
  }
);

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
