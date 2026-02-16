import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Обратна връзка – Спести",
  description:
    "Пишете ни ако забележите неточност, имате предложение или въпрос за платформата Спести.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
