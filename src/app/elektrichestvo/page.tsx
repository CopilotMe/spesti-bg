import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ElectricityCalculator = dynamic(
  () => import("@/components/calculator/ElectricityCalculator").then((m) => m.ElectricityCalculator),
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
  title: "Калкулатор сметка за ток – Сравни EVN, Електрохолд, Енерго-Про",
  description:
    "Изчисли месечната си сметка за електричество и сравни цените на EVN, Електрохолд и Енерго-Про. Разбери от какво се формира сметката ти. Актуални цени от КЕВР.",
  alternates: { canonical: "/elektrichestvo" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Как се изчислява сметката за ток в България?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Сметката за ток се формира от няколко компонента: цена на електроенергията (~45%), мрежови услуги — пренос и разпределение (~25%), задължения към обществото (зелена енергия, ВЕИ) (~15%), акциз и ДДС (~15%). Въведи kWh потребление в калкулатора и ще видиш точната разбивка.",
      },
    },
    {
      "@type": "Question",
      name: "Кой е най-евтиният доставчик на ток — EVN, Електрохолд или Енерго-Про?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Разликата между трите ЕРП-та е малка — около 1-2 € месечно при средно потребление. Електрохолд (София): 0.136 €/kWh дневна; EVN (Пловдив): 0.139 €/kWh; Енерго-Про (Варна): 0.142 €/kWh. Не можеш да избираш — доставчикът зависи от региона ти.",
      },
    },
    {
      "@type": "Question",
      name: "Каква е нощната тарифа за ток и как да я ползвам?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Нощната тарифа важи между 22:00 и 06:00 и е с 40-50% по-евтина от дневната. За да я ползваш, трябва двутарифен електромер. Пусни пералня, съдомиялна и бойлер нощем — спестяваш 4-6 € месечно.",
      },
    },
    {
      "@type": "Question",
      name: "Колко kWh консумира средното домакинство в България?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Средното домакинство консумира 150-250 kWh месечно. Апартамент до 60 кв.м. без електрическо отопление — около 150-180 kWh. С бойлер на ток — до 250 kWh. Виж точната разбивка в калкулатора.",
      },
    },
    {
      "@type": "Question",
      name: "Какво включва таксата за достъп до мрежата?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Таксата за достъп до мрежата е фиксирана месечна сума, която плащаш независимо колко ток консумираш. Покрива разходите за поддръжка на електрическата мрежа и за отчитане на електромера. За едно- и трифазни измервателни уреди тя е различна.",
      },
    },
  ],
};

export default function ElectricityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор за сметка за ток
        </h1>
        <p className="mt-2 text-muted">
          Въведи потреблението си и виж колко ще платиш при всеки
          електроразпределител. Всяка такса е обяснена достъпно и разбираемо.
        </p>
      </div>
      <ElectricityCalculator />
    </div>
  );
}
