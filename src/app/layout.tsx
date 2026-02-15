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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://spesti-bg-git-main-shteryo-dzhimovs-projects.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Спести.бг – Сравни сметки за ток, вода, газ и интернет | Безплатен калкулатор",
    template: "%s | Спести.бг",
  },
  description:
    "Безплатен калкулатор за сравнение на сметки за ток, вода, газ, интернет, кредити и застраховки в България. Виж кой доставчик е най-изгоден и спести. Актуални цени от КЕВР.",
  keywords: [
    "сметка за ток",
    "калкулатор сметка ток",
    "сравнение на доставчици",
    "цена вода",
    "цена на тока",
    "евтин интернет",
    "спести пари",
    "комунални сметки България",
    "сравнение цени ток",
    "ВиК калкулатор",
    "EVN калкулатор",
    "Електрохолд сметка",
    "Енерго-Про сметка",
    "газ цена",
    "кредитен калкулатор",
  ],
  openGraph: {
    title: "Спести.бг – Сравни сметките си и спести",
    description:
      "Безплатен калкулатор за сравнение на сметки за ток, вода, газ и интернет в България. Актуални цени от КЕВР.",
    locale: "bg_BG",
    type: "website",
    siteName: "Спести.бг",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Спести.бг – Сравни сметките си и спести",
    description:
      "Безплатен калкулатор за сравнение на комунални сметки в България.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
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
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Спести.бг",
                description:
                  "Безплатен калкулатор за сравнение на сметки за ток, вода, газ, интернет, кредити и застраховки в България.",
                url: SITE_URL,
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "All",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "BGN",
                },
                inLanguage: "bg",
                availableLanguage: "bg",
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Спести.бг",
                url: SITE_URL,
                logo: `${SITE_URL}/favicon.ico`,
                description:
                  "Безплатна платформа за сравнение на комунални сметки в България.",
                areaServed: {
                  "@type": "Country",
                  name: "Bulgaria",
                },
                knowsLanguage: "bg",
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Как мога да сравня сметката си за ток?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Въведете месечното си потребление в kWh и калкулаторът автоматично изчислява сметката при трите електроразпределителни дружества — Електрохолд (ЧЕЗ), EVN и Енерго-Про.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Безплатен ли е калкулаторът?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Да, Спести.бг е напълно безплатен. Не изисква регистрация и няма скрити такси.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Откъде са данните за цените?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Цените са от КЕВР (Комисия за енергийно и водно регулиране) и официалните сайтове на доставчиците. Данните за инфлацията са от Eurostat, а лихвите — от Европейската централна банка.",
                    },
                  },
                ],
              },
            ]),
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
