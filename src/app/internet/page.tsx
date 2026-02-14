import type { Metadata } from "next";
import { TelecomComparison } from "@/components/calculator/TelecomComparison";

export const metadata: Metadata = {
  title: "Сравнение на мобилни планове и домашен интернет",
  description:
    "Сравни мобилните планове на A1, Vivacom и Yettel и намери най-евтиния домашен интернет. Филтрирай по данни, скорост и оператор.",
};

export default function InternetPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Сравнение на интернет и мобилни планове
        </h1>
        <p className="mt-2 text-muted">
          Филтрирай по оператор, тип план и нужди и намери най-изгодната оферта
          за теб.
        </p>
      </div>
      <TelecomComparison />
    </div>
  );
}
