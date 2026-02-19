import { Metadata } from "next";
import dynamic from "next/dynamic";

const PurchasingPowerDashboard = dynamic(
  () =>
    import("@/components/calculator/PurchasingPowerDashboard").then(
      (m) => m.PurchasingPowerDashboard,
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
    "Покупателна способност в България – Колко купува заплатата ти? | Спести",
  description:
    "Колко хляб, мляко, бензин и kWh ток може да купи минималната и средна заплата в България? Сравни покупателната способност с ЕС.",
  alternates: { canonical: "/kupuvatelna-sposobnost" },
};

export default function PurchasingPowerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Покупателна способност в България
        </h1>
        <p className="mt-2 text-muted">
          Колко единици от основни продукти и услуги може да купи заплатата ти?
          Въведи нетната си заплата и виж какво можеш да си позволиш. Данни от
          КНСБ, КЕВР и Eurostat.
        </p>
      </div>
      <PurchasingPowerDashboard />
    </div>
  );
}
