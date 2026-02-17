import { Metadata } from "next";
import dynamic from "next/dynamic";
import { fetchFuelPrices } from "@/lib/api";

const FuelComparison = dynamic(
  () => import("@/components/calculator/FuelComparison").then((m) => m.FuelComparison),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане на цени на горива...</span>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Сравнение на цени на горива – Бензин, дизел, LPG",
  description:
    "Сравни цените на бензин, дизел и автогаз в 15+ бензиностанции в България. Виж кой е най-евтин и колко спестяваш годишно.",
  alternates: { canonical: "/goriva" },
};

export default async function FuelPage() {
  const livePrices = await fetchFuelPrices();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Сравнение на цени на горива
        </h1>
        <p className="mt-2 text-muted">
          Сравни цените на бензин, дизел и автогаз при различните вериги.
          Виж колко спестяваш годишно.
        </p>
      </div>
      <FuelComparison livePrices={livePrices} />
    </div>
  );
}
