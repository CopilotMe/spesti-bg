import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Zap,
  Droplets,
  Flame,
  Wifi,
  Fuel,
  Landmark,
  ShieldCheck,
  ShoppingBasket,
  TrendingUp,
  RefreshCw,
  Calculator,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Източници и методология – Спести",
  description:
    "Откъде идват данните в Спести, как се изчисляват резултатите и колко често се обновяват. Пълна прозрачност.",
  alternates: { canonical: "/metodologia" },
};

const sources = [
  {
    icon: Zap,
    title: "Електричество",
    source: "КЕВР (Комисия за енергийно и водно регулиране)",
    url: "https://www.dker.bg",
    frequency: "Годишно (обикновено от 1 юли)",
    method:
      "Цените се вземат от официалните решения на КЕВР за регулираните тарифи. За всеки регион се използва тарифата на съответния краен снабдител (ЕВН, Електрохолд, Енерго-Про). Изчислението включва цена за пренос, достъп, задължения към обществото и ДДС.",
  },
  {
    icon: Droplets,
    title: "Вода",
    source: "КЕВР",
    url: "https://www.dker.bg",
    frequency: "В рамките на 5-годишни регулаторни периоди",
    method:
      "Тарифите за водоснабдяване и канализация са по утвърдените от КЕВР бизнес-планове на ВиК операторите. Цената включва доставка, отвеждане, пречистване и ДДС. Показваме тарифите за всеки ВиК оператор поотделно.",
  },
  {
    icon: Flame,
    title: "Природен газ",
    source: "КЕВР + доставчици (Овергаз, Ситигаз и др.)",
    url: "https://www.dker.bg",
    frequency: "Тримесечно (КЕВР определя цена за пренос)",
    method:
      "Цената на природния газ за битови клиенти включва компонент, определен от КЕВР (пренос + разпределение) и компонент от крайния доставчик. Показваме крайната цена с ДДС.",
  },
  {
    icon: Wifi,
    title: "Интернет и мобилни планове",
    source: "Официални сайтове на A1, Vivacom и Yettel",
    url: null,
    frequency: "Ежемесечно (ръчна проверка)",
    method:
      "Плановете се събират директно от публично достъпните тарифни страници на трите оператора. Включваме месечна цена, включени минути/SMS/данни, скорост на интернет и срок на договор. Промоционалните цени са отбелязани отделно.",
  },
  {
    icon: Fuel,
    title: "Горива",
    source: "Официални сайтове на бензиностанции + КЕВР",
    url: null,
    frequency: "Ежеседмично",
    method:
      "Цените на бензин А95, дизел и автогаз са от публично обявените тарифи на Shell, OMV, Лукойл, Еко и Петрол. Акцизи и ДДС са включени. Данните за LPG и CNG са от официалните оператори.",
  },
  {
    icon: Landmark,
    title: "Кредити",
    source: "Официални сайтове на банки + БНБ",
    url: "https://www.bnb.bg",
    frequency: "Ежемесечно",
    method:
      "Лихвените проценти (ГПР и ГЛП) са от публично достъпните тарифи на водещите банки. Калкулаторът използва стандартна анюитетна формула. Резултатите са ориентировъчни — крайните условия зависят от индивидуална оценка на кредитоспособност.",
  },
  {
    icon: ShieldCheck,
    title: "Застраховки",
    source: "Официални сайтове на застрахователи + КФН",
    url: "https://www.fsc.bg",
    frequency: "Тримесечно",
    method:
      "Премиите са ориентировъчни и базирани на публично достъпни тарифи. Крайната цена зависи от индивидуални фактори (възраст, стаж, регион, вид автомобил и др.). Показваме ГО, КАСКО, здравни и имуществени застраховки.",
  },
  {
    icon: ShoppingBasket,
    title: "Потребителска кошница",
    source: "КНСБ (Конфедерация на независимите синдикати в България)",
    url: "https://knsb-bg.org",
    frequency: "Ежемесечно",
    method:
      "КНСБ наблюдава цените на 21 основни хранителни продукта в над 600 магазина в 81 общини. Показваме средните цени за страната. Допълнително зареждаме индекса на потребителските цени (HICP) от Eurostat за контекст на инфлацията.",
  },
  {
    icon: TrendingUp,
    title: "БВП",
    source: "Eurostat (namq_10_gdp)",
    url: "https://ec.europa.eu/eurostat",
    frequency: "Тримесечно (автоматично, revalidate: 24 часа)",
    method:
      "Тримесечният растеж на БВП се зарежда автоматично от Eurostat REST API. Използваме верижно свързани обеми (CLV_PCH_SM) за год./год. растеж. Сравняваме България с Румъния, Гърция и средното за ЕС-27.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-text md:text-3xl">
        Източници и методология
      </h1>
      <p className="mb-8 text-sm text-muted">
        Откъде идват данните, как се изчисляват и колко често се обновяват.
      </p>

      <div className="space-y-8 text-text">
        {/* Intro */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="mb-1 font-semibold text-primary">
                Нашият подход
              </h2>
              <p className="text-sm text-muted">
                Спести използва само публично достъпни, официални данни от
                регулатори и институции. Където е възможно, данните се зареждат
                автоматично чрез API. Останалите се проверяват и актуализират
                ръчно от нашия екип. Всеки калкулатор показва източника и датата
                на последна актуализация.
              </p>
            </div>
          </div>
        </div>

        {/* Auto-update explanation */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Как работи автоматичното обновяване</h2>
          </div>
          <p className="text-sm text-muted">
            Секциите БВП и Потребителска кошница (HICP) зареждат данни директно
            от Eurostat REST API с интервал на обновяване от 24 часа
            (revalidate). Това означава, че когато Eurostat публикува нови данни,
            те ще се появят на Спести в рамките на един ден — без ръчна
            намеса.
          </p>
        </div>

        {/* Methodology explanation */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Как изчисляваме резултатите</h2>
          </div>
          <div className="space-y-2 text-sm text-muted">
            <p>
              Калкулаторите за ток, вода и газ прилагат официалните тарифни
              компоненти (цена за енергия/вода, пренос, достъп, такси) върху
              въведеното от вас потребление. Всички цени включват ДДС 20%.
            </p>
            <p>
              Сравненията между доставчици използват идентичен обем потребление,
              за да покажат реалната разлика в крайната цена. Разликата
              &quot;по-скъпо с X&quot; е спрямо най-евтината опция.
            </p>
            <p>
              Всички стойности от преди 1 януари 2026 г. са конвертирани от BGN
              в EUR по фиксирания курс 1 EUR = 1.95583 BGN.
            </p>
          </div>
        </div>

        {/* Sources grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Източници по категории
          </h2>
          <div className="space-y-4">
            {sources.map((s) => {
              const Icon = s.icon;
              return (
                <details
                  key={s.title}
                  className="group rounded-xl border border-border bg-surface"
                >
                  <summary className="flex cursor-pointer items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                    <Icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-medium">{s.title}</span>
                    <span className="ml-auto text-xs text-muted group-open:hidden">
                      &#x25BC;
                    </span>
                    <span className="ml-auto text-xs text-muted hidden group-open:inline">
                      &#x25B2;
                    </span>
                  </summary>
                  <div className="border-t border-border px-4 py-4 text-sm text-muted space-y-2">
                    <p>
                      <strong className="text-text">Източник:</strong>{" "}
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary underline"
                        >
                          {s.source}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        s.source
                      )}
                    </p>
                    <p>
                      <strong className="text-text">Честота:</strong>{" "}
                      {s.frequency}
                    </p>
                    <p>
                      <strong className="text-text">Методология:</strong>{" "}
                      {s.method}
                    </p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted">
          Ако забележите неточност или остарели данни,{" "}
          <Link href="/kontakt" className="text-primary underline">
            пишете ни
          </Link>
          . Стремим се към максимална точност и ще коригираме възможно
          най-бързо.
        </p>
      </div>
    </div>
  );
}
