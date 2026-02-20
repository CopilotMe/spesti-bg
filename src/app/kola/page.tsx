import { Metadata } from "next";
import dynamic from "next/dynamic";

const CarCostDashboard = dynamic(
  () =>
    import("@/components/calculator/CarCostDashboard").then(
      (m) => m.CarCostDashboard,
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
  title: "Калкулатор за кола – Месечни разходи за автомобил | Спести",
  description:
    "Изчисли реалната месечна цена на колата: гориво, застраховки ГО и КАСКО, данък, винетка, поддръжка и амортизация.",
  alternates: { canonical: "/kola" },
};

export default function CarCostPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор: Цена на колата
        </h1>
        <p className="mt-2 text-muted">
          Колко реално ти струва колата на месец? Гориво, застраховки, данъци,
          поддръжка и амортизация — всичко на едно място.
        </p>
      </div>
      <CarCostDashboard />
    </div>
  );
}
