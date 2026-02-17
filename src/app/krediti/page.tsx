import { Metadata } from "next";
import dynamic from "next/dynamic";

const LoanCalculator = dynamic(
  () => import("@/components/calculator/LoanCalculator").then((m) => m.LoanCalculator),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане на калкулатора...</span>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Кредитен калкулатор – Сравни лихви по кредити",
  description:
    "Сравни потребителски и жилищни кредити от ДСК, УниКредит, Райфайзен и други банки. Изчисли месечната вноска и общата лихва.",
  alternates: { canonical: "/krediti" },
};

export default function LoansPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Кредитен калкулатор — сравни банките
        </h1>
        <p className="mt-2 text-muted">
          Въведи желаната сума и срок, и виж коя банка предлага най-ниска вноска
          и най-малко лихва.
        </p>
      </div>
      <LoanCalculator />
    </div>
  );
}
