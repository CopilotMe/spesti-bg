import type { Metadata } from "next";
import { ElectricityCalculator } from "@/components/calculator/ElectricityCalculator";

export const metadata: Metadata = {
  title: "Калкулатор за сметка за ток",
  description:
    "Изчисли месечната си сметка за електричество и сравни цените на EVN, Електрохолд и Енерго-Про. Разбери от какво се формира сметката ти.",
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
          електроразпределител. Всяка такса е обяснена на прост език.
        </p>
      </div>
      <ElectricityCalculator />
    </div>
  );
}
