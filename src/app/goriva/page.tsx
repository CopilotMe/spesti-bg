import { Metadata } from "next";
import { FuelComparison } from "@/components/calculator/FuelComparison";
import { fetchFuelPrices } from "@/lib/api";

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
