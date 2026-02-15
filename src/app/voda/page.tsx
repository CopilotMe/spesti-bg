import type { Metadata } from "next";
import { WaterCalculator } from "@/components/calculator/WaterCalculator";

export const metadata: Metadata = {
  title: "Калкулатор сметка за вода – Сравни ВиК цени по градове",
  description:
    "Изчисли месечната си сметка за вода и сравни ВиК цените в 23 града. Виж разбивка на водоснабдяване, канализация и пречистване с ДДС.",
  alternates: { canonical: "/voda" },
};

export default function WaterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор за сметка за вода
        </h1>
        <p className="mt-2 text-muted">
          Въведи потреблението си в кубични метри и сравни цените на водата в
          различните градове. Всяка такса е обяснена достъпно и разбираемо.
        </p>
      </div>
      <WaterCalculator />
    </div>
  );
}
