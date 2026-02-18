import { Metadata } from "next";
import dynamic from "next/dynamic";

const InflationDashboard = dynamic(
  () =>
    import("@/components/calculator/InflationDashboard").then(
      (m) => m.InflationDashboard
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане на данни от Eurostat...</span>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title:
    "Инфлация в България – HICP по категории, сравнение с ЕС | Спести",
  description:
    "Актуална инфлация в България по 12 категории: храни, жилище, транспорт, здраве и други. Сравнение с ЕС средно. Данни от Eurostat HICP, обновявани автоматично.",
  alternates: { canonical: "/inflacia" },
};

export default function InflationPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Инфлация в България
        </h1>
        <p className="mt-2 text-muted">
          Годишна промяна на потребителските цени по 12 категории. Данни от
          Eurostat HICP (Хармонизиран индекс на потребителските цени),
          обновявани автоматично. Сравнете България с ЕС средно и проследете
          коя категория удря най-силно бюджета ви.
        </p>
      </div>
      <InflationDashboard />
    </div>
  );
}
