import { Metadata } from "next";
import { CombinedDashboard } from "@/components/calculator/CombinedDashboard";

export const metadata: Metadata = {
  title: "Комбиниран калкулатор – Всички разходи на едно място | Спести.бг",
  description:
    "Виж общите месечни разходи за ток, вода, газ, интернет и кредит на едно място. Живи данни от ECB, Eurostat и Open-Meteo.",
};

export default function CombinedPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Комбиниран калкулатор — всички разходи
        </h1>
        <p className="mt-2 text-muted">
          Въведи потреблението си за всички услуги и виж общата месечна сметка.
          С живи данни от ECB, Eurostat и Open-Meteo.
        </p>
      </div>
      <CombinedDashboard />
    </div>
  );
}
