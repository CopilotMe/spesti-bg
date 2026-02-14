import { Metadata } from "next";
import { GasCalculator } from "@/components/calculator/GasCalculator";

export const metadata: Metadata = {
  title: "Газ калкулатор – Сравни цените на газ | Спести.бг",
  description:
    "Сравни цените на природния газ от Овергаз, Ситигаз и други доставчици. Виж разбивка на сметката с ДДС.",
};

export default function GasPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Газ за бита — сравнение на цени
        </h1>
        <p className="mt-2 text-muted">
          Въведи месечното си потребление на газ и виж коя компания е
          най-изгодна в твоя регион.
        </p>
      </div>
      <GasCalculator />
    </div>
  );
}
