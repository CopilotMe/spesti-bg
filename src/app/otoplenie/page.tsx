import { Metadata } from "next";
import dynamic from "next/dynamic";

const HeatingCostDashboard = dynamic(
  () =>
    import("@/components/calculator/HeatingCostDashboard").then(
      (m) => m.HeatingCostDashboard,
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
  title:
    "Калкулатор отопление – Ток vs Газ vs Климатик | Спести",
  description:
    "Сравни месечната цена на отопление с ток, газ и климатик (термопомпа). Реална прогноза спрямо 7-дневната метеорологична прогноза за твоя град.",
  alternates: { canonical: "/otoplenie" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Кое е най-евтиното отопление — ток, газ или климатик?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Климатикът (термопомпа) е най-евтин: ~0.047 €/kWh топлина при COP 3.0. Газовото котле: ~0.063 €/kWh. Електрическият конвектор: ~0.14 €/kWh. Климатикът е близо 3 пъти по-евтин от конвектора при еднакъв комфорт. Въведи данните за апартамента си в калкулатора за точно сравнение.",
      },
    },
    {
      "@type": "Question",
      name: "Колко плаща средно семейство за отопление на месец?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "За апартамент 60 кв.м. зимен месец: с конвектор ~63 €, с газ ~35 €, с климатик ~21 €. За 5-месечен сезон: конвектор 315 €, газ 175 €, климатик 105 €. Разликата между конвектор и климатик е 210 € на сезон.",
      },
    },
    {
      "@type": "Question",
      name: "Какво е COP на климатика и защо е важно?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "COP (Coefficient of Performance) показва колко kWh топлина произвежда климатикът на 1 kWh ток. COP 3.0 = за 1 kWh ток получаваш 3 kWh топлина. При -5°C COP на модерен инвертерен климатик е 2.5-3.5. По-висок COP = по-евтино отопление.",
      },
    },
    {
      "@type": "Question",
      name: "Струва ли си да сменя конвектора с климатик?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "При месечна сметка от 63 € с конвектор и климатик за 1 000 €, спестяваш ~42 €/мес → климатикът се изплаща за ~24 месеца. Допълнителна полза: охлаждане през лятото без допълнителен разход. При по-висока сметка периодът е по-кратък.",
      },
    },
    {
      "@type": "Question",
      name: "Как нощната тарифа намалява разходите за отопление с климатик?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Нощната тарифа (22:00-06:00) е с 40-50% по-евтина. При климатик + нощна тарифа: 0.075 €/kWh ÷ COP 3.0 = 0.025 €/kWh топлина — по-евтино и от газа! Пусни климатика да загрее апартамента нощем и намали термостата дневно.",
      },
    },
  ],
};

export default function HeatingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор за отопление
        </h1>
        <p className="mt-2 text-muted">
          Сравни месечната цена на отопление с ток (конвектор), природен газ
          и климатик (термопомпа). Прогнозата използва реални метеорологични
          данни за твоя град.
        </p>
      </div>
      <HeatingCostDashboard />
    </div>
  );
}
