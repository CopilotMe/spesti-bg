import { Metadata } from "next";
import { GdpDashboard } from "@/components/calculator/GdpDashboard";

export const metadata: Metadata = {
  title: "БВП на България – Растеж, сравнение с ЕС и съседи",
  description:
    "Актуален растеж на БВП на България по тримесечия. Автоматични данни от Eurostat. Сравнение с Румъния, Гърция и средното за ЕС.",
  alternates: { canonical: "/bvp" },
};

export default function GdpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          БВП на България
        </h1>
        <p className="mt-2 text-muted">
          Тримесечен растеж на брутния вътрешен продукт с автоматични данни от
          Eurostat. Сравни България с Румъния, Гърция и средното за ЕС.
        </p>
      </div>
      <GdpDashboard />
    </div>
  );
}
