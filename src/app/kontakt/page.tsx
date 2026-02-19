import { Metadata } from "next";
import dynamic from "next/dynamic";

const ContactForm = dynamic(
  () =>
    import("@/components/calculator/ContactForm").then((m) => m.ContactForm),
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
  title: "Обратна връзка – Спести",
  description:
    "Забелязахте грешка, имате предложение или въпрос? Пишете ни директно чрез формата за обратна връзка.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-text md:text-3xl">
        Обратна връзка
      </h1>
      <p className="mb-8 text-sm text-muted">
        Забелязахте грешка, имате предложение или въпрос? Пишете ни.
      </p>
      <ContactForm />
    </div>
  );
}
