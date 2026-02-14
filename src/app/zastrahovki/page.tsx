import { Metadata } from "next";
import { InsuranceComparison } from "@/components/calculator/InsuranceComparison";

export const metadata: Metadata = {
  title: "Застраховки – Сравни ГО, КАСКО, здравни | Спести.бг",
  description:
    "Сравни застраховки от ДЗИ, Булстрад, Алианц, Лев Инс и Евроинс. ГО, КАСКО, здравни и имуществени застраховки.",
};

export default function InsurancePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Застраховки — сравни офертите
        </h1>
        <p className="mt-2 text-muted">
          Сравни цени за гражданска отговорност, КАСКО, здравна и имуществена
          застраховка от водещите застрахователи в България.
        </p>
      </div>
      <InsuranceComparison />
    </div>
  );
}
