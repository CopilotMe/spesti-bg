import { Metadata } from "next";
import dynamic from "next/dynamic";

const GasCalculator = dynamic(
  () => import("@/components/calculator/GasCalculator").then((m) => m.GasCalculator),
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
  title: "Газ калкулатор – Сравни цените на природен газ",
  description:
    "Сравни цените на природния газ от Овергаз, Ситигаз и други доставчици. Виж разбивка на сметката с ДДС. Актуални тарифи.",
  alternates: { canonical: "/gaz" },
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
