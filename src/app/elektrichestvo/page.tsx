import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ElectricityCalculator = dynamic(
  () => import("@/components/calculator/ElectricityCalculator").then((m) => m.ElectricityCalculator),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане на калкулатора...</span>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Калкулатор сметка за ток – Сравни EVN, Електрохолд, Енерго-Про",
  description:
    "Изчисли месечната си сметка за електричество и сравни цените на EVN, Електрохолд и Енерго-Про. Разбери от какво се формира сметката ти. Актуални цени от КЕВР.",
  alternates: { canonical: "/elektrichestvo" },
};

export default function ElectricityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор за сметка за ток
        </h1>
        <p className="mt-2 text-muted">
          Въведи потреблението си и виж колко ще платиш при всеки
          електроразпределител. Всяка такса е обяснена достъпно и разбираемо.
        </p>
      </div>
      <ElectricityCalculator />
    </div>
  );
}
