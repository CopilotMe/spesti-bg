import { Metadata } from "next";
import dynamic from "next/dynamic";

const MobilePlanComparison = dynamic(
  () =>
    import("@/components/calculator/MobilePlanComparison").then(
      (m) => m.MobilePlanComparison,
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted">Зареждане...</span>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title:
    "Сравнение на мобилни планове – A1, Vivacom, Yettel | Най-евтиният план | Спести",
  description:
    "Сравни 28 мобилни плана на A1, Vivacom и Yettel. Филтрирай по GB данни, минути и тип (предплатен/абонамент). Намери най-евтиния план за теб.",
  alternates: { canonical: "/mobilni-planove" },
};

export default function MobilePlanPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Сравнение на мобилни планове
        </h1>
        <p className="mt-2 text-muted">
          Сравни предплатени и абонаментни планове на A1, Vivacom и Yettel.
          Филтрирай по данни, минути и оператор и намери най-изгодния план за
          теб.
        </p>
      </div>
      <MobilePlanComparison />
    </div>
  );
}
