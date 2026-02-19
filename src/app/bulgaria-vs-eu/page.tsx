import { Metadata } from "next";
import dynamic from "next/dynamic";

const EuComparisonDashboard = dynamic(
  () =>
    import("@/components/calculator/EuComparisonDashboard").then(
      (m) => m.EuComparisonDashboard,
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">
          Зареждане на данни от Eurostat...
        </span>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title:
    "България vs ЕС – Цени, заплати, инфлация | Сравнение с Европа | Спести",
  description:
    "Сравни цени на ток, минимални заплати, инфлация и цена на труда в България с ЕС, Румъния, Германия и Гърция. Данни от Eurostat.",
  alternates: { canonical: "/bulgaria-vs-eu" },
};

export default function BulgariaVsEuPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          България vs ЕС
        </h1>
        <p className="mt-2 text-muted">
          Сравнение на цени, заплати, инфлация и цена на труда между България
          и останалите страни в ЕС. Всички данни са от Eurostat и се обновяват
          автоматично.
        </p>
      </div>
      <EuComparisonDashboard />
    </div>
  );
}
