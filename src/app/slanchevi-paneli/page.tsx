import { Metadata } from "next";
import dynamic from "next/dynamic";

const SolarPanelDashboard = dynamic(
  () =>
    import("@/components/calculator/SolarPanelDashboard").then(
      (m) => m.SolarPanelDashboard,
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
  title: "Слънчеви панели калкулатор – ROI и спестявания | Спести",
  description:
    "Изчисли възвръщаемостта от слънчеви панели: срок на изплащане, 25-годишни спестявания и месечна икономия на ток.",
  alternates: { canonical: "/slanchevi-paneli" },
};

export default function SolarPanelPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор за слънчеви панели
        </h1>
        <p className="mt-2 text-muted">
          Изчисли възвръщаемостта от фотоволтаична система: покривна площ,
          годишно производство, срок на изплащане и 25-годишни спестявания.
        </p>
      </div>
      <SolarPanelDashboard />
    </div>
  );
}
