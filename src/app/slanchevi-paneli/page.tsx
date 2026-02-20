import { Metadata } from "next";
import dynamic from "next/dynamic";

const SolarPanelDashboard = dynamic(
  () =>
    import("@/components/calculator/SolarPanelDashboard").then(
      (m) => m.SolarPanelDashboard,
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
  title: "Слънчеви панели калкулатор – ROI и спестявания | Спести",
  description:
    "Изчисли възвръщаемостта от слънчеви панели: срок на изплащане, 25-годишни спестявания и месечна икономия на ток.",
  alternates: { canonical: "/slanchevi-paneli" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "За колко години се изплащат слънчевите панели в България?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "При средна сметка 60 €/мес и 6 kW система (6 600 €): ~9 години без net metering, ~7-8 години с net metering. При сметка 100 €/мес — само 5-6 години. Въведи данните си в калкулатора за точна прогноза.",
      },
    },
    {
      "@type": "Question",
      name: "Колко струва соларна система за дом в България?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Цената е ~1 100 €/kW (панели + инвертор + монтаж). За 20 кв.м. → 4 kW → ~4 400 €. За 30 кв.м. → 6 kW → ~6 600 €. На 12-та година инверторът се подменя (~700 €). Системата има живот 25 години.",
      },
    },
    {
      "@type": "Question",
      name: "Колко kWh произвежда 1 kW слънчеви панели в България?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Средно ~1 300 kWh/год (1 100 kWh на Север, 1 500 kWh на Юг). 6 kW система → ~7 800 kWh/год. Панелите деградират с ~0.5%/год, но запазват добро производство за 25 години.",
      },
    },
    {
      "@type": "Question",
      name: "Какво е net metering за слънчеви панели?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Net metering позволява да продаваш излишната произведена енергия обратно в мрежата. Достъпно за системи до 10.8 kW в България. С net metering спестяванията растат с ~30% и периодът на изплащане се съкращава с 1-2 години.",
      },
    },
    {
      "@type": "Question",
      name: "Колко спестяваш от слънчеви панели за 25 години?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "При 6 kW система и сметка 60 €/мес: нетна печалба ~12 200 € (след покриване на инвестицията 7 300 €). При сметка 100 €/мес — над 20 000 € нетна печалба. Виж точната 25-годишна графика в калкулатора.",
      },
    },
  ],
};

export default function SolarPanelPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор за слънчеви панели
        </h1>
        <p className="mt-2 text-muted">
          Изчисли възвръщаемостта от фотоволтаична система: покривна площ,
          годишно производство, срок на изплащане и 25-годишни спестявания.
        </p>
      </div>
      <SolarPanelDashboard />
    </div>
  );
}
