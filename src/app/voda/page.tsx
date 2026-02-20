import type { Metadata } from "next";
import dynamic from "next/dynamic";

const WaterCalculator = dynamic(
  () => import("@/components/calculator/WaterCalculator").then((m) => m.WaterCalculator),
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
  title: "Калкулатор сметка за вода – Сравни ВиК цени по градове",
  description:
    "Изчисли месечната си сметка за вода и сравни ВиК цените в 23 града. Виж разбивка на водоснабдяване, канализация и пречистване с ДДС.",
  alternates: { canonical: "/voda" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Колко кубика вода консумира средно едно лице в България?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Средното потребление е 3-5 кубика на месец на човек. За семейство от 3 души — около 10-15 кубика месечно. Душ вместо вана намалява разхода с 30-40%.",
      },
    },
    {
      "@type": "Question",
      name: "Защо сметката за вода е различна в различните градове?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Цената зависи от три фактора: 1) Състоянието на водопреносната мрежа; 2) Наличие на пречиствателна станция (добавя 20-40%); 3) Инвестиционната програма на ВиК оператора. Разликата между най-евтиния (Пловдив, ~1.77 €/м³) и най-скъпия може да е над 50%.",
      },
    },
    {
      "@type": "Question",
      name: "Какво включва сметката за вода?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Сметката се формира от три компонента: водоснабдяване (доставка на чиста вода), канализация (отвеждане на отпадъчна вода) и пречистване. Не всички градове имат и трите компонента — проверете в калкулатора за вашия град.",
      },
    },
    {
      "@type": "Question",
      name: "Как да намаля сметката за вода?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Практични съвети: монтирай аератори на крановете (намаляват разхода с 30-50% без загуба на налягане), проверявай за течове (капещ кран = 30-40 литра/ден), предпочитай душ пред вана, пускай пералнята и съдомиялната само при пълен барабан.",
      },
    },
  ],
};

export default function WaterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Калкулатор за сметка за вода
        </h1>
        <p className="mt-2 text-muted">
          Въведи потреблението си в кубични метри и сравни цените на водата в
          различните градове. Всяка такса е обяснена достъпно и разбираемо.
        </p>
      </div>
      <WaterCalculator />
    </div>
  );
}
