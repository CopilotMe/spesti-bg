import { Metadata } from "next";
import dynamic from "next/dynamic";

const WaterComparisonDashboard = dynamic(
  () =>
    import("@/components/calculator/WaterComparisonDashboard").then(
      (m) => m.WaterComparisonDashboard,
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
  title: "Сравнение на водата по градове – 22 града | Спести",
  description:
    "Сравни цената на водата в 22 български града. Виж кой град е най-скъп и колко можеш да спестиш. Данни от КЕВР.",
  alternates: { canonical: "/voda-sravnenie" },
};

export default function WaterComparisonPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Вода по градове — Сравнение на 22 града
        </h1>
        <p className="mt-2 text-muted">
          Цената на водата варира до 40% между градовете. Виж класацията и
          разбери от какво се формира тарифата в твоя град.
        </p>
      </div>
      <WaterComparisonDashboard />
    </div>
  );
}
