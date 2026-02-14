import { Metadata } from "next";
import { LoanCalculator } from "@/components/calculator/LoanCalculator";

export const metadata: Metadata = {
  title: "Кредитен калкулатор – Сравни лихви по кредити | Спести.бг",
  description:
    "Сравни потребителски и жилищни кредити от ДСК, УниКредит, Райфайзен и други банки. Изчисли вноската и общата лихва.",
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
