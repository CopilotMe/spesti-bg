import { Metadata } from "next";
import dynamic from "next/dynamic";

const FinancialProfileDashboard = dynamic(
  () =>
    import("@/components/calculator/FinancialProfileDashboard").then(
      (m) => m.FinancialProfileDashboard,
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
  title: "Личен Финансов Профил – Колко харчиш на месец? | Спести",
  description:
    "Въведи домакинството си веднъж и виж пълната месечна картина: ток, вода, газ, гориво, храна, застраховки. Личен процент инфлация, работни дни за всяка сметка и потенциал за спестяване.",
  alternates: { canonical: "/profil" },
};

export default function ProfilPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          ✨ Ново
        </div>
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Личен Финансов Профил
        </h1>
        <p className="mt-2 text-muted">
          Въведи данните за домакинството си и виж пълната месечна финансова
          картина — ток, вода, газ, храна, гориво, интернет и повече. Всичко на
          едно място, само за теб.
        </p>
      </div>
      <FinancialProfileDashboard />
    </div>
  );
}
