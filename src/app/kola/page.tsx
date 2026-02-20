import { Metadata } from "next";
import dynamic from "next/dynamic";

const CarCostDashboard = dynamic(
  () =>
    import("@/components/calculator/CarCostDashboard").then(
      (m) => m.CarCostDashboard,
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
  title: "Калкулатор за кола – Месечни разходи за автомобил | Спести",
  description:
    "Изчисли реалната месечна цена на колата: гориво, застраховки ГО и КАСКО, данък, винетка, поддръжка и амортизация.",
  alternates: { canonical: "/kola" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Колко струва колата на месец реално в България?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "При бензинова кола, 1 000 км/мес, стойност 10 000 €, без КАСКО: гориво 87 €, ГО 10 €, данък 5 €, винетка 4 €, ГТП 4 €, поддръжка 25 €, амортизация 83 € = общо ~218 €/мес. С КАСКО добавяш още 40-60 €. Изчисли точно за своята кола в калкулатора.",
      },
    },
    {
      "@type": "Question",
      name: "Какво е амортизацията на автомобила и как се изчислява?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Амортизацията е загубата на стойност на колата с времето. Нова кола губи 20-25% от стойността само в първата година, после ~10-15% годишно. Кола за 20 000 € губи ~4 000 € стойност за година = 333 €/мес. Употребявана кола (3-5 г.) има по-ниска амортизация.",
      },
    },
    {
      "@type": "Question",
      name: "Колко е данък МПС за различни мощности?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Данъкът зависи от мощността и екологичния клас: до 74 kW (Евро 4+): ~25-35 €/год; 75-110 kW (Евро 4+): ~45-70 €/год; над 110 kW: ~80-120 €/год. При по-стара кола (Евро 1-2) данъкът е 2-3 пъти по-висок. Ранно плащане (до 31 март) дава 5% отстъпка.",
      },
    },
    {
      "@type": "Question",
      name: "По-изгодно ли е такси или собствена кола?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "При ~218 €/мес за собствена кола: градски транспорт е само ~25 €/мес, Bolt/Uber при 30 пътувания ~150 €/мес. Ако живееш в голям град с добър транспорт, отказването от кола спестява 150-200 €/мес. Виж точното сравнение в калкулатора.",
      },
    },
    {
      "@type": "Question",
      name: "Кое е по-изгодно — бензин, дизел или LPG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LPG/газ е най-евтиното гориво (~0.58 €/л). При 1 000 км и 10 л/100 км: бензин ~87 €, дизел ~75 €, LPG ~43 €. Монтажът на газова уредба (400-700 €) се изплаща за 6-10 месеца при редовно каране.",
      },
    },
  ],
};

export default function CarCostPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор: Цена на колата
        </h1>
        <p className="mt-2 text-muted">
          Колко реално ти струва колата на месец? Гориво, застраховки, данъци,
          поддръжка и амортизация — всичко на едно място.
        </p>
      </div>
      <CarCostDashboard />
    </div>
  );
}
