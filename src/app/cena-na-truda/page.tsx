import { Metadata } from "next";
import dynamic from "next/dynamic";

const LabourCostCalculator = dynamic(
  () =>
    import("@/components/calculator/LabourCostCalculator").then(
      (m) => m.LabourCostCalculator,
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане...</span>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title:
    "Цена на труда за работодателя – Осигуровки и данъци 2026 | Спести",
  description:
    "Изчисли реалната цена на служител за работодателя. Разбивка на осигуровки (ДОО, ДЗПО, ЗО), данъци и сравнение с ЕС. Актуални ставки 2026.",
  alternates: { canonical: "/cena-na-truda" },
};

export default function LabourCostPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Цена на труда за работодателя
        </h1>
        <p className="mt-2 text-muted">
          Изчисли колко реално струва един служител на работодателя. Виж
          разбивката на осигуровки (ДОО, ДЗПО, ЗО, ГВРС, ТЗПБ), данък
          общ доход и сравни с часовата цена на труда в ЕС.
        </p>
      </div>
      <LabourCostCalculator />
    </div>
  );
}
