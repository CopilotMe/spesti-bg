import type { Metadata } from "next";
import {
  Rocket,
  BarChart3,
  Fuel,
  Globe,
  Handshake,
  Gauge,
  ShoppingBasket,
  BookOpen,
  Calculator,
  TrendingUp,
  Banknote,
  FileDown,
  ShieldCheck,
  BadgeEuro,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Какво ново – Спести",
  description:
    "Последни подобрения и нови функции в Спести — безплатен сравнител на комунални сметки в България.",
  alternates: { canonical: "/release-notes" },
  robots: { index: false, follow: false },
};

interface ReleaseEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  changes: { type: "new" | "improved" | "fix"; text: string }[];
}

const releases: ReleaseEntry[] = [
  {
    version: "0.14.0",
    date: "19 февруари 2026",
    title: "4 нови безплатни страници",
    description:
      "Евро конвертор, България vs ЕС, мобилни планове и покупателна способност — нови анализи с готови данни.",
    icon: <BadgeEuro className="h-5 w-5" />,
    color: "text-emerald-600 bg-emerald-100",
    changes: [
      {
        type: "new",
        text: "Евро конвертор — BGN↔EUR конверсия + проверка дали цените след еврото са честни (21 продукта)",
      },
      {
        type: "new",
        text: "България vs ЕС — сравнение на заплати, цени на ток, инфлация и часова цена на труда с Eurostat данни",
      },
      {
        type: "new",
        text: "Мобилни планове — филтриране и сравнение на 28 плана от A1, Vivacom и Yettel",
      },
      {
        type: "new",
        text: "Покупателна способност — колко продукти купува заплатата ти, с тренд и ЕС сравнение",
      },
      {
        type: "improved",
        text: "Начална страница с 4 нови категории и обновен sitemap",
      },
    ],
  },
  {
    version: "0.13.0",
    date: "19 февруари 2026",
    title: "Pro активация с код и Revolut плащане",
    description:
      "Сигурна активация на Spesti Pro чрез активационен код след плащане с Revolut. Нова страница /pro/activate с двустъпков процес.",
    icon: <ShieldCheck className="h-5 w-5" />,
    color: "text-amber-600 bg-amber-100",
    changes: [
      {
        type: "new",
        text: "Страница /pro/activate — въвеждане на активационен код след плащане",
      },
      {
        type: "new",
        text: "API endpoint /api/pro/activate — сървърна валидация на кодове с HMAC-SHA256 токен",
      },
      {
        type: "new",
        text: "Revolut интеграция — бутон за плащане на 0.99 \u20ac директно от страницата",
      },
      {
        type: "improved",
        text: "Pro статус вече се верифицира със signed token вместо plain localStorage",
      },
      {
        type: "fix",
        text: "Затворена уязвимост: /pro/success вече не активира Pro без валиден код",
      },
    ],
  },
  {
    version: "0.12.0",
    date: "18 \u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438 2026",
    title: "PDF \u0435\u043A\u0441\u043F\u043E\u0440\u0442 \u0438 Feature Flag \u0441\u0438\u0441\u0442\u0435\u043C\u0430 (\u0421\u043F\u0435\u0441\u0442\u0438 Pro)",
    description:
      "\u0411\u0443\u0442\u043E\u043D \u201E\u0418\u0437\u0442\u0435\u0433\u043B\u0438 PDF\u201C \u043D\u0430 4 dashboard-\u0430 (\u0417\u0430\u043F\u043B\u0430\u0442\u0438, \u0418\u043D\u0444\u043B\u0430\u0446\u0438\u044F, \u041A\u043E\u0448\u043D\u0438\u0446\u0430, \u0411\u044E\u0434\u0436\u0435\u0442). \u0421\u043A\u0440\u0438\u0442 \u0437\u0430\u0434 feature flag \u0437\u0430 \u0431\u044A\u0434\u0435\u0449\u0430 Pro \u0432\u0435\u0440\u0441\u0438\u044F.",
    icon: <FileDown className="h-5 w-5" />,
    color: "text-purple-600 bg-purple-100",
    changes: [
      {
        type: "new",
        text: "PDF \u0435\u043A\u0441\u043F\u043E\u0440\u0442 \u0441 \u0431\u0440\u0430\u043D\u0434\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u0421\u043F\u0435\u0441\u0442\u0438, \u0434\u0430\u0442\u0430 \u0438 disclaimer",
      },
      {
        type: "new",
        text: "Feature flag \u0441\u0438\u0441\u0442\u0435\u043C\u0430 (NEXT_PUBLIC_ENABLE_PRO) \u0437\u0430 Pro \u0444\u0443\u043D\u043A\u0446\u0438\u0438",
      },
      {
        type: "new",
        text: "Multi-page PDF \u0437\u0430 \u0434\u044A\u043B\u0433\u0438 dashboard-\u0438 (\u041A\u043E\u0448\u043D\u0438\u0446\u0430 \u0441 21 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430)",
      },
      {
        type: "improved",
        text: "Dynamic import \u043D\u0430 PDF \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438\u0442\u0435 \u2014 \u043D\u0443\u043B\u0435\u0432 \u0435\u0444\u0435\u043A\u0442 \u0432\u044A\u0440\u0445\u0443 bundle size",
      },
    ],
  },
  {
    version: "0.11.0",
    date: "18 февруари 2026",
    title: "Заплати в България — Нето/Бруто калкулатор и Eurostat данни",
    description:
      "Нова страница с калкулатор нето/бруто заплата за 2026 г. с актуални осигурителни ставки, сравнение на минималната заплата с ЕС и часова цена на труда.",
    icon: <Banknote className="h-5 w-5" />,
    color: "text-emerald-600 bg-emerald-100",
    changes: [
      {
        type: "new",
        text: "Калкулатор нето/бруто с подробна разбивка на осигуровки и данък (2026)",
      },
      {
        type: "new",
        text: "Сравнение на минималната заплата: България, Румъния, Германия, Гърция, Хърватия",
      },
      {
        type: "new",
        text: "Часова цена на труда в ЕС — хоризонтална стълбовидна диаграма",
      },
      {
        type: "new",
        text: "Индекс на разходите за труд (2020=100) — тримесечни данни от Eurostat",
      },
      {
        type: "improved",
        text: "Бързи бутони за МРЗ (620 \u20AC), средна заплата и други стойности",
      },
      {
        type: "improved",
        text: "Кръгова диаграма за визуализация на дяловете от заплатата",
      },
    ],
  },
  {
    version: "0.10.0",
    date: "18 февруари 2026",
    title: "Инфлация в България — 12 категории от Eurostat",
    description:
      "Нова страница с пълен преглед на инфлацията по 12 категории (храни, жилище, транспорт, здраве и др.) с данни от Eurostat HICP.",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-red-600 bg-red-100",
    changes: [
      {
        type: "new",
        text: "Страница /inflacia с 12 COICOP категории на инфлацията",
      },
      {
        type: "new",
        text: "Сравнение България vs ЕС средно — обща инфлация",
      },
      {
        type: "new",
        text: "Интерактивна графика — изберете кои категории да сравните",
      },
      {
        type: "new",
        text: "Хоризонтална стълбовидна диаграма по категории за последния месец",
      },
      {
        type: "improved",
        text: "Данните се обновяват автоматично от Eurostat (revalidate: 24 часа)",
      },
    ],
  },
  {
    version: "0.9.0",
    date: "17 февруари 2026",
    title: "Партньорска програма и спонсорирани обяви",
    description:
      "Стартирахме партньорската инфраструктура — affiliate линкове, баджове \u201EПартньор\u201C и \u201EСпонсорирано\u201C, и нова страница за партньори.",
    icon: <Handshake className="h-5 w-5" />,
    color: "text-purple-600 bg-purple-100",
    changes: [
      {
        type: "new",
        text: "Страница \u201EПартньорство\u201C с 3 нива: Affiliate/CPA, Спонсорирано, API & White-Label",
      },
      {
        type: "new",
        text: "Бадж \u201EПартньор\u201C (зелен) и \u201EСпонсорирано\u201C (жълт) в таблиците с резултати",
      },
      {
        type: "new",
        text: "Бутон \u201EВиж оферта\u201C с проследяващи UTM линкове във всички калкулатори",
      },
      {
        type: "new",
        text: "Имейл за партньорства: partnerships@spesti.app",
      },
      {
        type: "improved",
        text: "Колоната \u201EСайт\u201C преименувана на \u201EОферта\u201C за по-ясно действие",
      },
    ],
  },
  {
    version: "0.8.0",
    date: "16 февруари 2026",
    title: "Производителност и достъпност — 99/100 Mobile",
    description:
      "Оптимизирахме скоростта и достъпността на платформата до почти перфектни резултати в Google PageSpeed.",
    icon: <Gauge className="h-5 w-5" />,
    color: "text-green-600 bg-green-100",
    changes: [
      {
        type: "improved",
        text: "Mobile Performance: от 78 на 99/100 в Google PageSpeed",
      },
      {
        type: "improved",
        text: "Accessibility: от 93 на 100/100 — пълен WCAG compliance",
      },
      {
        type: "fix",
        text: "Елиминиран render-blocking CSS с inline стилове и dns-prefetch",
      },
      {
        type: "fix",
        text: "Поправени контрастни съотношения и йерархия на заглавията",
      },
      {
        type: "fix",
        text: "Подобрени label асоциации на формите за screen reader",
      },
      {
        type: "improved",
        text: "Добавен Vercel Speed Insights за мониторинг",
      },
    ],
  },
  {
    version: "0.7.0",
    date: "15 февруари 2026",
    title: "Горива — 15 бензиностанции с live цени",
    description:
      "Разширихме сравнението на горива от 6 на 15 бензиностанции с реални цени от Fuelo.net API.",
    icon: <Fuel className="h-5 w-5" />,
    color: "text-orange-600 bg-orange-100",
    changes: [
      {
        type: "new",
        text: "Интеграция с Fuelo.net API за live цени на бензин, дизел и LPG",
      },
      {
        type: "new",
        text: "15 бензиностанции: Shell, OMV, Lukoil, Petrol, EKO, Rompetrol и други",
      },
      {
        type: "new",
        text: "Добавени LPG цени за AVIA и Rompetrol",
      },
      {
        type: "improved",
        text: "Автоматично обновяване на цените — без ръчно въвеждане",
      },
    ],
  },
  {
    version: "0.6.0",
    date: "14 февруари 2026",
    title: "Блог — анализи и съвети за спестяване",
    description:
      "Пуснахме блог секция с полезни статии за бюджетиране, смяна на доставчик и анализ на потребителската кошница.",
    icon: <BookOpen className="h-5 w-5" />,
    color: "text-blue-600 bg-blue-100",
    changes: [
      {
        type: "new",
        text: "Блог с търсене, тагове, категории и сортиране (най-нов първо)",
      },
      {
        type: "new",
        text: "Статия: \u201EКакво може да си позволи едно семейство с минимална заплата\u201C",
      },
      {
        type: "new",
        text: "Статия: \u201EКак да изберете и смените доставчик на комунални услуги\u201C",
      },
      {
        type: "new",
        text: "Статия: \u201EЗащо потребителската кошница поскъпва\u201C",
      },
      {
        type: "new",
        text: "Статия: \u201EЦени на горивата — февруари 2026\u201C",
      },
    ],
  },
  {
    version: "0.5.0",
    date: "13 февруари 2026",
    title: "Потребителска кошница и БВП",
    description:
      "Нови секции за проследяване на потребителската кошница (21 продукта от КНСБ) и БВП данни от Eurostat.",
    icon: <ShoppingBasket className="h-5 w-5" />,
    color: "text-emerald-600 bg-emerald-100",
    changes: [
      {
        type: "new",
        text: "Малка потребителска кошница — 21 продукта с цени от КНСБ",
      },
      {
        type: "new",
        text: "БВП секция с данни от Eurostat и графика на разходите",
      },
      {
        type: "new",
        text: "Root-cause анализ: защо цените растат (инфлация, внос, ДДС)",
      },
      {
        type: "improved",
        text: "6 нови категории в бюджетния калкулатор по заявка на потребители",
      },
    ],
  },
  {
    version: "0.4.0",
    date: "12 февруари 2026",
    title: "Конвертиране в EUR и нови страници",
    description:
      "Преминахме изцяло на евро по фиксиран курс 1.95583. Добавени страници за поверителност, условия и методология.",
    icon: <Globe className="h-5 w-5" />,
    color: "text-indigo-600 bg-indigo-100",
    changes: [
      {
        type: "improved",
        text: "Всички цени конвертирани от BGN в EUR (÷ 1.95583)",
      },
      {
        type: "new",
        text: "Политика за поверителност, Условия за ползване, Методология",
      },
      {
        type: "new",
        text: "Контактна форма с Web3Forms интеграция (без exposed имейли)",
      },
      {
        type: "fix",
        text: "Поправена визуализация на кошница графиката — изключени непълни данни",
      },
    ],
  },
  {
    version: "0.3.0",
    date: "10 февруари 2026",
    title: "Кредити, застраховки и телеком",
    description:
      "Стартирахме три нови калкулатора — за потребителски кредити, автомобилни застраховки и мобилни/интернет планове.",
    icon: <Calculator className="h-5 w-5" />,
    color: "text-teal-600 bg-teal-100",
    changes: [
      {
        type: "new",
        text: "Кредитен калкулатор — сравнение по лихва, ГПР и месечна вноска",
      },
      {
        type: "new",
        text: "Застрахователен калкулатор — \u201EКаско\u201C и \u201EГражданска отговорност\u201C",
      },
      {
        type: "new",
        text: "Телеком сравнение — мобилни планове и домашен интернет (A1, Yettel, VIVACOM)",
      },
      {
        type: "new",
        text: "Комбиниран изглед — всички калкулатори на една страница",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "8 февруари 2026",
    title: "Семеен бюджет калкулатор",
    description:
      "Калкулатор за планиране на месечния бюджет с реални цени за ток, вода и газ в България.",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "text-cyan-600 bg-cyan-100",
    changes: [
      {
        type: "new",
        text: "Бюджетен калкулатор с автоматично изчисление на комунални разходи",
      },
      {
        type: "new",
        text: "Обзорна карта — визуализация на разходите по категория",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "6 февруари 2026",
    title: "Първа версия — ток, вода и газ",
    description:
      "Стартирахме Спести с три основни калкулатора за най-важните комунални сметки в България.",
    icon: <Rocket className="h-5 w-5" />,
    color: "text-primary bg-primary/10",
    changes: [
      {
        type: "new",
        text: "Калкулатор за електричество — по региони, с нощна/дневна тарифа",
      },
      {
        type: "new",
        text: "Калкулатор за вода — с ВиК оператор по област",
      },
      {
        type: "new",
        text: "Калкулатор за природен газ — с цена от КЕВР",
      },
      {
        type: "new",
        text: "Responsive дизайн с Tailwind CSS и тъмен/светъл режим",
      },
      {
        type: "new",
        text: "Данни от КЕВР, Евростат и официалните сайтове",
      },
    ],
  },
];

const typeConfig = {
  new: { label: "Ново", className: "bg-emerald-100 text-emerald-700" },
  improved: {
    label: "Подобрено",
    className: "bg-blue-100 text-blue-700",
  },
  fix: { label: "Поправка", className: "bg-amber-100 text-amber-700" },
};

export default function ReleaseNotesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Rocket className="h-4 w-4" />
          Какво ново
        </div>
        <h1 className="mb-3 text-2xl font-bold text-text md:text-3xl">
          Какво ново в Спести
        </h1>
        <p className="text-muted">
          Проследете развитието на платформата — нови функции, подобрения и
          поправки.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 hidden h-[calc(100%-2rem)] w-0.5 bg-border md:block" />

        <div className="space-y-8">
          {releases.map((release, index) => (
            <article key={release.version} className="relative md:pl-14">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1 hidden h-10 w-10 items-center justify-center md:flex">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${release.color}`}
                >
                  {release.icon}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/30">
                {/* Header */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    v{release.version}
                  </span>
                  <span className="text-xs text-muted">{release.date}</span>
                  {index === 0 && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Последна
                    </span>
                  )}
                </div>

                <h2 className="mb-1 text-lg font-bold text-text">
                  {release.title}
                </h2>
                <p className="mb-4 text-sm text-muted">
                  {release.description}
                </p>

                {/* Changes list */}
                <ul className="space-y-2">
                  {release.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none ${typeConfig[change.type].className}`}
                      >
                        {typeConfig[change.type].label}
                      </span>
                      <span className="text-sm text-text">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-10 rounded-xl border border-border bg-primary/5 p-5 text-center">
        <p className="text-sm text-muted">
          Имате идея за подобрение? Пишете ни на{" "}
          <a
            href="/kontakt"
            className="font-medium text-primary hover:underline"
          >
            страницата за обратна връзка
          </a>
          .
        </p>
      </div>
    </div>
  );
}
