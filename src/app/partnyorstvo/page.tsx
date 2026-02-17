import type { Metadata } from "next";
import {
  Handshake,
  Users,
  BarChart3,
  Code2,
  Mail,
  Zap,
  ShieldCheck,
  TrendingUp,
  Megaphone,
  Landmark,
  Crown,
  Bell,
  FileText,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Партньорство със Спести – Affiliate, Спонсорирано, API & White-Label",
  description:
    "Станете партньор на Спести. Affiliate програма за доставчици, спонсорирани обяви, банков referral, Pro features и white-label решения.",
  alternates: { canonical: "/partnyorstvo" },
};

export default function PartnershipPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Handshake className="h-4 w-4" />
          Партньорска програма
        </div>
        <h1 className="mb-4 text-3xl font-bold text-text md:text-4xl">
          Партньорство със Спести
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          100+ потребителя сравняват комунални сметки всеки месец.
          Присъединете се към нашата партньорска мрежа и достигнете до
          аудитория, която активно търси по-добра оферта.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-12 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <p className="text-3xl font-bold text-primary">100+</p>
          <p className="text-sm text-muted">месечни потребители</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <p className="text-3xl font-bold text-primary">10+</p>
          <p className="text-sm text-muted">калкулатора</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <p className="text-3xl font-bold text-primary">50+</p>
          <p className="text-sm text-muted">сравнени доставчика</p>
        </div>
      </div>

      {/* Tier 1: Affiliate / CPA за доставчици */}
      <section className="mb-12">
        <div className="mb-1 flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-text">
            Affiliate / CPA за доставчици
          </h2>
        </div>
        <p className="mb-6 text-xs font-medium text-primary">Tier 1 — Готово за стартиране</p>
        <p className="mb-6 text-muted">
          Достигнете до потребители, които активно търсят по-добра оферта за
          ток, вода, газ, интернет, кредити или застраховки.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <Zap className="mb-3 h-5 w-5 text-primary" />
            <h3 className="mb-1 font-semibold text-text">Качествен трафик</h3>
            <p className="text-sm text-muted">
              Потребителите ни са на етап &quot;сравнение&quot; — те вече търсят
              нов доставчик и са готови да действат.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
            <h3 className="mb-1 font-semibold text-text">Прозрачно позициониране</h3>
            <p className="text-sm text-muted">
              Партньорските линкове са ясно маркирани с бадж &quot;Партньор&quot;. Позицията в
              сравненията зависи само от цената.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <BarChart3 className="mb-3 h-5 w-5 text-primary" />
            <h3 className="mb-1 font-semibold text-text">Плащане за резултат</h3>
            <p className="text-sm text-muted">
              CPA (Cost per Acquisition), CPL (Cost per Lead) или CPC — избирате
              модела, който работи за вас.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-2 font-semibold text-text">Как да започнем?</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-muted">
            <li>Свържете се с нас на имейла по-долу</li>
            <li>Договаряме модел и условия (CPA/CPL/CPC)</li>
            <li>Получавате tracking линк за вашия продукт</li>
            <li>Вашата оферта се показва с бадж &quot;Партньор&quot; в калкулаторите</li>
          </ol>
        </div>
      </section>

      {/* Tier 1b: Referral за банки */}
      <section className="mb-12">
        <div className="mb-1 flex items-center gap-2">
          <Landmark className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-text">
            Referral програма за банки
          </h2>
        </div>
        <p className="mb-6 text-xs font-medium text-primary">Tier 1 — Готово за стартиране</p>
        <p className="mb-6 text-muted">
          Кредитният ни калкулатор вече сравнява банки по лихва и ГПР.
          С referral линк потребителят отива директно към вашата оферта.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-2 font-semibold text-text">Как работи?</h3>
            <ul className="space-y-1 text-sm text-muted">
              <li>Потребителят въвежда сума и срок</li>
              <li>Калкулаторът показва вашата банка с вноска и ГПР</li>
              <li>Бутон &quot;Виж оферта&quot; води към вашия referral линк</li>
              <li>Получавате commission при одобрен кредит</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-2 font-semibold text-text">Подходящо за</h3>
            <ul className="space-y-1 text-sm text-muted">
              <li><strong>Потребителски кредити</strong> — сравнение по лихва</li>
              <li><strong>Жилищни кредити</strong> — сравнение по ГПР</li>
              <li><strong>Рефинансиране</strong> — показваме спестяването</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tier 2a: Спонсорирани обяви */}
      <section className="mb-12">
        <div className="mb-1 flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-text">
            Спонсорирани обяви
          </h2>
        </div>
        <p className="mb-6 text-xs font-medium text-amber-600">Tier 2 — Налично</p>
        <p className="mb-6 text-muted">
          Покажете вашата оферта с бадж &quot;Спонсорирано&quot; в сравнителните таблици.
          Прозрачно за потребителите, ефективно за вас.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <Megaphone className="mb-3 h-5 w-5 text-amber-600" />
            <h3 className="mb-1 font-semibold text-text">Видимост</h3>
            <p className="text-sm text-muted">
              Бадж &quot;Спонсорирано&quot; в жълто, ясно различим от обикновените резултати.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-amber-600" />
            <h3 className="mb-1 font-semibold text-text">Честна класация</h3>
            <p className="text-sm text-muted">
              Позицията в таблицата остава по цена. Спонсорирането добавя само
              визуална маркировка.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <BarChart3 className="mb-3 h-5 w-5 text-amber-600" />
            <h3 className="mb-1 font-semibold text-text">Фиксирана такса</h3>
            <p className="text-sm text-muted">
              Месечна или годишна такса за показване. Без скрити разходи.
            </p>
          </div>
        </div>
      </section>

      {/* Tier 2b: Pro features (Freemium) */}
      <section className="mb-12">
        <div className="mb-1 flex items-center gap-2">
          <Crown className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-text">
            Спести Pro (скоро)
          </h2>
        </div>
        <p className="mb-6 text-xs font-medium text-purple-600">Tier 2 — В разработка</p>
        <p className="mb-6 text-muted">
          Премиум функции за потребители, които искат повече контрол
          над своите разходи и спестявания.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-text">Известия и следене</h3>
            </div>
            <ul className="space-y-1 text-sm text-muted">
              <li>Email известие при промяна на тарифа</li>
              <li>Месечен доклад за разходите</li>
              <li>Алерт &quot;Сметката ти се покачи с 15%&quot;</li>
            </ul>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-text">Разширени инструменти</h3>
            </div>
            <ul className="space-y-1 text-sm text-muted">
              <li>Персонализирани препоръки за спестяване</li>
              <li>PDF експорт на сравнения</li>
              <li>История на тарифите и ценови графики</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tier 3: API & White-Label */}
      <section className="mb-12">
        <div className="mb-1 flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-text">
            API & White-Label
          </h2>
        </div>
        <p className="mb-6 text-xs font-medium text-primary">Tier 3 — B2B</p>
        <p className="mb-6 text-muted">
          Вградете нашите калкулатори и данни във вашия продукт.
          Подходящо за банки, имотни агенции, финтех компании и медии.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-2 font-semibold text-text">API достъп</h3>
            <ul className="space-y-1 text-sm text-muted">
              <li>Цени на комуналните услуги (ток, вода, газ)</li>
              <li>HICP инфлация и потребителска кошница</li>
              <li>Цени на горивата (live от Fuelo.net)</li>
              <li>БВП данни от Eurostat</li>
              <li>Лихвени проценти по кредити</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-2 font-semibold text-text">White-Label решения</h3>
            <ul className="space-y-1 text-sm text-muted">
              <li>Вграден калкулатор с ваш бранд</li>
              <li>Персонализирани цветове и лого</li>
              <li>Iframe или React компонент</li>
              <li>Автоматично обновяване на данните</li>
              <li>SLA и техническа поддръжка</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h3 className="mb-1 font-semibold text-text">Примерни приложения</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted">
                <li><strong>Банки:</strong> калкулатор за комунални разходи към ипотечното кредитиране</li>
                <li><strong>Имотни агенции:</strong> оценка на месечните разходи при покупка на имот</li>
                <li><strong>Финтех:</strong> интегриран бюджет планер с реални цени</li>
                <li><strong>Медии:</strong> интерактивни визуализации на цените на енергията</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="rounded-2xl border-2 border-primary bg-primary/5 p-8 text-center">
        <Mail className="mx-auto mb-4 h-8 w-8 text-primary" />
        <h2 className="mb-2 text-xl font-bold text-text">
          Свържете се с нас
        </h2>
        <p className="mb-4 text-muted">
          Имате въпроси за партньорство, спонсорирани обяви, API или white-label?
        </p>
        <a
          href="mailto:partnerships@spesti.app"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Mail className="h-4 w-4" />
          partnerships@spesti.app
        </a>
        <p className="mt-3 text-xs text-muted">
          Отговаряме в рамките на 1-2 работни дни.
        </p>
      </section>
    </div>
  );
}
