import { Metadata } from "next";
import dynamic from "next/dynamic";

const HeatingCostDashboard = dynamic(
  () =>
    import("@/components/calculator/HeatingCostDashboard").then(
      (m) => m.HeatingCostDashboard,
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане на данни...</span>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title:
    "Калкулатор отопление – Ток vs Газ vs Климатик | Спести",
  description:
    "Сравни месечната цена на отопление с ток, газ и климатик (термопомпа). Реална прогноза спрямо 7-дневната метеорологична прогноза за твоя град.",
  alternates: { canonical: "/otoplenie" },
};

export default function HeatingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор за отопление
        </h1>
        <p className="mt-2 text-muted">
          Сравни месечната цена на отопление с ток (конвектор), природен газ
          и климатик (термопомпа). Прогнозата използва реални метеорологични
          данни за твоя град.
        </p>
      </div>
      <HeatingCostDashboard />
    </div>
  );
}
