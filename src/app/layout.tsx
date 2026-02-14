import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spesti-bg-git-main-shteryo-dzhimovs-projects.vercel.app"),
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Спести.бг",
              description:
                "Безплатен калкулатор за сравнение на сметки за ток, вода и интернет в България.",
              url: "https://spesti-bg-git-main-shteryo-dzhimovs-projects.vercel.app",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "BGN",
              },
              inLanguage: "bg",
              availableLanguage: "bg",
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
