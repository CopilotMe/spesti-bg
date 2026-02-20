import { Metadata } from "next";
import dynamic from "next/dynamic";

const BillBreakdownDashboard = dynamic(
  () =>
    import("@/components/calculator/BillBreakdownDashboard").then(
      (m) => m.BillBreakdownDashboard,
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
  title: "Разбивка на сметката – Ток, Газ, Вода | Спести",
  description:
    "Виж какъв процент от сметката ти за ток, газ или вода отива за производство, пренос, разпределение и данъци. Данни от КЕВР.",
  alternates: { canonical: "/razbivka-smetka" },
};

export default function BillBreakdownPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Разбивка на сметката
        </h1>
        <p className="mt-2 text-muted">
          Виж от какво се формира сметката ти за ток, газ или вода. Само малка
          част от цената е реалната енергия — останалото е за пренос, мрежи и
          данъци.
        </p>
      </div>
      <BillBreakdownDashboard />
    </div>
  );
}
