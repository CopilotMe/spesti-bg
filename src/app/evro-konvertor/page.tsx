import { Metadata } from "next";
import dynamic from "next/dynamic";

const EuroConverter = dynamic(
  () =>
    import("@/components/calculator/EuroConverter").then(
      (m) => m.EuroConverter,
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
    "Евро конвертор BGN/EUR – Фиксиран курс 1.95583 | Проверка на цените | Спести",
  description:
    "Конвертирай лева в евро и обратно по фиксиран курс 1.95583. Провери дали цените на 21 продукта след еврото са честни или закръглени нагоре.",
  alternates: { canonical: "/evro-konvertor" },
};

export default function EuroConverterPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Евро конвертор BGN ↔ EUR
        </h1>
        <p className="mt-2 text-muted">
          Конвертирай суми между лева и евро по фиксирания курс 1.95583.
          Провери дали цените на 21 основни продукта от малката кошница са
          конвертирани честно или закръглени нагоре.
        </p>
      </div>
      <EuroConverter />
    </div>
  );
}
