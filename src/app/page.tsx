import { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/layout/CategoryCard";
import { ArrowRight, Shield, TrendingDown, Eye } from "lucide-react";
import messages from "@/messages/bg.json";

export const metadata: Metadata = {
  title: "Спести – Сравни сметки за ток, вода, газ и интернет | Безплатен калкулатор",
  description:
    "Безплатен калкулатор за сравнение на сметки за ток, вода, газ, интернет, кредити и застраховки в България. Виж кой доставчик е най-евтин. Данни от КЕВР.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const t = messages;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold leading-tight text-text md:text-5xl">
            {t.hero.title}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted">
            {t.hero.subtitle}
          </p>
          <Link
            href="/elektrichestvo"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
          >
            {t.hero.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-muted">{t.hero.trusted}</p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CategoryCard
            title={t.categories.electricity.title}
            description={t.categories.electricity.description}
            icon={t.categories.electricity.icon}
            href="/elektrichestvo"
          />
          <CategoryCard
            title={t.categories.water.title}
            description={t.categories.water.description}
            icon={t.categories.water.icon}
            href="/voda"
          />
          <CategoryCard
            title={t.categories.gas.title}
            description={t.categories.gas.description}
            icon={t.categories.gas.icon}
            href="/gaz"
          />
          <CategoryCard
            title={t.categories.internet.title}
            description={t.categories.internet.description}
            icon={t.categories.internet.icon}
            href="/internet"
          />
          <CategoryCard
            title={t.categories.loans.title}
            description={t.categories.loans.description}
            icon={t.categories.loans.icon}
            href="/krediti"
          />
          <CategoryCard
            title={t.categories.insurance.title}
            description={t.categories.insurance.description}
            icon={t.categories.insurance.icon}
            href="/zastrahovki"
          />
          <CategoryCard
            title={t.categories.fuel.title}
            description={t.categories.fuel.description}
            icon={t.categories.fuel.icon}
            href="/goriva"
          />
          <CategoryCard
            title={t.categories.basket.title}
            description={t.categories.basket.description}
            icon={t.categories.basket.icon}
            href="/koshnitsa"
          />
          <CategoryCard
            title={t.categories.budget.title}
            description={t.categories.budget.description}
            icon={t.categories.budget.icon}
            href="/budget"
          />
        </div>
        <div className="mx-auto mt-6 max-w-5xl">
          <CategoryCard
            title={t.categories.combined.title}
            description={t.categories.combined.description}
            icon={t.categories.combined.icon}
            href="/kombiniran"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-text">
            {t.howItWorks.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {t.howItWorks.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <h3 className="mb-2 font-semibold text-text">{step.title}</h3>
                <p className="text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h4 className="font-semibold text-text">Официални данни</h4>
              <p className="text-sm text-muted">
                Цените са от КЕВР и официалните сайтове на доставчиците.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h4 className="font-semibold text-text">100% безплатно</h4>
              <p className="text-sm text-muted">
                Без регистрация, без реклами, без скрити условия.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h4 className="font-semibold text-text">Прозрачност</h4>
              <p className="text-sm text-muted">
                Всяка такса е обяснена достъпно и разбираемо.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
