import { Metadata } from "next";
import dynamic from "next/dynamic";

const SalaryDashboard = dynamic(
  () =>
    import("@/components/calculator/SalaryDashboard").then(
      (m) => m.SalaryDashboard
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане...</span>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title:
    "Заплати в България – Нето/Бруто калкулатор, минимална заплата, сравнение с ЕС | Спести",
  description:
    "Калкулатор нето/бруто заплата 2026 с осигуровки и данък. Минимална заплата в България vs ЕС. Часова цена на труда и ръст на заплатите. Данни от Eurostat.",
  alternates: { canonical: "/zaplati" },
};

export default function SalaryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Заплати в България
        </h1>
        <p className="mt-2 text-muted">
          Изчисли нетната си заплата от брутната (или обратно) с актуалните
          осигурителни ставки за 2026 г. Сравни минималната заплата с ЕС,
          виж часовата цена на труда и как растат заплатите спрямо 2020.
        </p>
      </div>
      <SalaryDashboard />
    </div>
  );
}
