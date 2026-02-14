import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Спести.бг - Сравни сметките си и спести",
    template: "%s | Спести.бг",
  },
  description:
    "Безплатен калкулатор за сравнение на сметки за ток, вода и интернет в България. Виж кой доставчик е най-изгоден и спести от скритите такси.",
  keywords: [
    "сметка за ток",
    "сравнение на доставчици",
    "цена вода",
    "евтин интернет",
    "спести пари",
    "комунални сметки България",
  ],
  openGraph: {
    title: "Спести.бг - Сравни сметките си и спести",
    description:
      "Безплатен калкулатор за сравнение на сметки за ток, вода и интернет в България.",
    locale: "bg_BG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
