import { Metadata } from "next";
import dynamic from "next/dynamic";

const BudgetCalculator = dynamic(
  () => import("@/components/calculator/BudgetCalculator").then((m) => m.BudgetCalculator),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане на бюджет калкулатора...</span>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Семеен бюджет – Калкулатор на месечни разходи",
  description:
    "Планирай семейния си бюджет с нашия безплатен калкулатор. Въведи доходи и разходи, сравни с българската средна стойност и открий къде можеш да спестиш.",
  alternates: { canonical: "/budget" },
};

export default function BudgetPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Семеен бюджет
        </h1>
        <p className="mt-2 text-muted">
          Планирай месечните си разходи, сравни с българската средна стойност и
          открий къде можеш да спестиш. Комуналните сметки се изчисляват
          автоматично от нашите калкулатори.
        </p>
      </div>
      <BudgetCalculator />
    </div>
  );
}
