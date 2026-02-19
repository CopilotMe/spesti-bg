import { Metadata } from "next";
import dynamic from "next/dynamic";

const AirQualityDashboard = dynamic(
  () =>
    import("@/components/calculator/AirQualityDashboard").then(
      (m) => m.AirQualityDashboard,
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
    "Качество на въздуха – PM10, PM2.5 и AQI в реално време | Спести",
  description:
    "Актуално качество на въздуха в София, Пловдив, Варна и Бургас. PM10, PM2.5 и европейски индекс AQI. Данни от Open-Meteo, обновяване на всеки час.",
  alternates: { canonical: "/kachestvo-na-vazduh" },
};

export default function AirQualityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Качество на въздуха
        </h1>
        <p className="mt-2 text-muted">
          Актуални нива на PM10, PM2.5 и европейски индекс за качество на
          въздуха (AQI) в четирите най-големи града. Данни от Open-Meteo,
          обновяване на всеки час.
        </p>
      </div>
      <AirQualityDashboard />
    </div>
  );
}
