import { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/layout/CategoryCard";
import { ArrowRight, Shield, TrendingDown, Eye, Sparkles } from "lucide-react";
import messages from "@/messages/bg.json";

export const metadata: Metadata = {
  title: "Спести – Сравни сметки за ток, вода, газ и интернет | Безплатен калкулатор",
  description:
    "Безплатен калкулатор за сравнение на сметки за ток, вода, газ, интернет, кредити и застраховки в България. Виж кой доставчик е най-евтин. Данни от КЕВР.",
  alternates: {
    canonical: "/",
  },
};

function GroupHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-text">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

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
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/elektrichestvo"
              className="inline-flex items-center gap-2 rounded-full bg-primary-dark px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary"
            >
              {t.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <Sparkles className="h-4 w-4" />
              Моят финансов профил
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">{t.hero.trusted}</p>
        </div>
      </section>

      {/* New feature banner */}
      <section className="border-y border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-4 py-5">
        <Link href="/profil" className="group mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-text">
                Ново ✨ Личен Финансов Профил
              </p>
              <p className="text-sm text-muted">
                Въведи домакинството си → пълна месечна картина, работни дни за всяка сметка и лична инфлация
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* All Calculators — grouped */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-14">

          {/* Group 1: Комунални сметки */}
          <div>
            <GroupHeader
              title="💡 Комунални сметки"
              subtitle="Ток, вода, газ, интернет и отопление — сравни тарифи и разбери всяка такса"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                title={t.categories.mobilePlans.title}
                description={t.categories.mobilePlans.description}
                icon={t.categories.mobilePlans.icon}
                href="/mobilni-planove"
              />
              <CategoryCard
                title={t.categories.heating.title}
                description={t.categories.heating.description}
                icon={t.categories.heating.icon}
                href="/otoplenie"
              />
              <CategoryCard
                title={t.categories.billBreakdown.title}
                description={t.categories.billBreakdown.description}
                icon={t.categories.billBreakdown.icon}
                href="/razbivka-smetka"
              />
              <CategoryCard
                title={t.categories.waterComparison.title}
                description={t.categories.waterComparison.description}
                icon={t.categories.waterComparison.icon}
                href="/voda-sravnenie"
              />
              <CategoryCard
                title={t.categories.combined.title}
                description={t.categories.combined.description}
                icon={t.categories.combined.icon}
                href="/kombiniran"
              />
            </div>
          </div>

          {/* Group 2: Транспорт и имущество */}
          <div>
            <GroupHeader
              title="🚗 Транспорт и имущество"
              subtitle="Гориво, автомобил, слънчеви панели и застраховки"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <CategoryCard
                title={t.categories.fuel.title}
                description={t.categories.fuel.description}
                icon={t.categories.fuel.icon}
                href="/goriva"
              />
              <CategoryCard
                title={t.categories.carCost.title}
                description={t.categories.carCost.description}
                icon={t.categories.carCost.icon}
                href="/kola"
              />
              <CategoryCard
                title={t.categories.insurance.title}
                description={t.categories.insurance.description}
                icon={t.categories.insurance.icon}
                href="/zastrahovki"
              />
              <CategoryCard
                title={t.categories.solarPanels.title}
                description={t.categories.solarPanels.description}
                icon={t.categories.solarPanels.icon}
                href="/slanchevi-paneli"
              />
            </div>
          </div>

          {/* Group 3: Лични финанси */}
          <div>
            <GroupHeader
              title="💰 Лични финанси"
              subtitle="Кредити, бюджет, заплата и евро конвертор"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <CategoryCard
                title={t.categories.loans.title}
                description={t.categories.loans.description}
                icon={t.categories.loans.icon}
                href="/krediti"
              />
              <CategoryCard
                title={t.categories.budget.title}
                description={t.categories.budget.description}
                icon={t.categories.budget.icon}
                href="/budget"
              />
              <CategoryCard
                title={t.categories.salary.title}
                description={t.categories.salary.description}
                icon={t.categories.salary.icon}
                href="/zaplati"
              />
              <CategoryCard
                title={t.categories.euroConverter.title}
                description={t.categories.euroConverter.description}
                icon={t.categories.euroConverter.icon}
                href="/evro-konvertor"
              />
              <CategoryCard
                title={t.categories.labourCost.title}
                description={t.categories.labourCost.description}
                icon={t.categories.labourCost.icon}
                href="/cena-na-truda"
              />
            </div>
          </div>

          {/* Group 4: Икономически анализи */}
          <div>
            <GroupHeader
              title="📊 Икономически анализи"
              subtitle="БВП, инфлация, покупателна способност и сравнение с ЕС"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <CategoryCard
                title={t.categories.basket.title}
                description={t.categories.basket.description}
                icon={t.categories.basket.icon}
                href="/koshnitsa"
              />
              <CategoryCard
                title={t.categories.inflation.title}
                description={t.categories.inflation.description}
                icon={t.categories.inflation.icon}
                href="/inflacia"
              />
              <CategoryCard
                title={t.categories.gdp.title}
                description={t.categories.gdp.description}
                icon={t.categories.gdp.icon}
                href="/bvp"
              />
              <CategoryCard
                title={t.categories.purchasingPower.title}
                description={t.categories.purchasingPower.description}
                icon={t.categories.purchasingPower.icon}
                href="/kupuvatelna-sposobnost"
              />
              <CategoryCard
                title={t.categories.euComparison.title}
                description={t.categories.euComparison.description}
                icon={t.categories.euComparison.icon}
                href="/bulgaria-vs-eu"
              />
              <CategoryCard
                title={t.categories.airQuality.title}
                description={t.categories.airQuality.description}
                icon={t.categories.airQuality.icon}
                href="/kachestvo-na-vazduh"
              />
            </div>
          </div>

          {/* Killer feature: Profile — full-width featured card */}
          <div>
            <GroupHeader
              title="✨ Всичко заедно"
              subtitle="Нова функция — виж цялата финансова картина на домакинството си на едно място"
            />
            <CategoryCard
              title={t.categories.profile.title}
              description={t.categories.profile.description}
              icon={t.categories.profile.icon}
              href="/profil"
              featured
            />
          </div>

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
              <h3 className="font-semibold text-text">Официални данни</h3>
              <p className="text-sm text-muted">
                Цените са от КЕВР и официалните сайтове на доставчиците.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold text-text">100% безплатно</h3>
              <p className="text-sm text-muted">
                Без регистрация, без реклами, без скрити условия.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold text-text">Прозрачност</h3>
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
