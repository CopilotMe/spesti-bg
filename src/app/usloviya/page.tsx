import type { Metadata } from "next";
import { FileText, AlertTriangle, Scale, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Условия за ползване – Спести",
  description:
    "Условия за ползване на платформата Спести. Информативен характер, без гаранции за абсолютна точност.",
  alternates: { canonical: "/usloviya" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-text md:text-3xl">
        Условия за ползване
      </h1>
      <p className="mb-8 text-sm text-muted">
        Последна актуализация: 16 февруари 2026 г.
      </p>

      <div className="space-y-8 text-text">
        {/* Intro */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="mb-1 font-semibold text-primary">Накратко</h2>
              <p className="text-sm text-muted">
                Спести е безплатен информативен инструмент. Не сме регулатор,
                банка или финансов съветник. Данните са от официални източници, но
                ви препоръчваме винаги да проверявате при доставчика си преди да
                вземете решение.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              1. Какво представлява Спести
            </h2>
          </div>
          <div className="space-y-3 pl-7 text-sm text-muted">
            <p>
              Спести е безплатна, отворена платформа за сравнение на комунални
              разходи, потребителски цени и макроикономически данни в България.
              Платформата е достъпна без регистрация и без реклами.
            </p>
            <p>
              Целта е да предостави на потребителите ясен и разбираем преглед на
              техните разходи, базиран на официални данни от регулатори и
              публични институции.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              2. Информативен характер
            </h2>
          </div>
          <div className="space-y-3 pl-7 text-sm text-muted">
            <p>
              Всички изчисления, сравнения и данни на платформата имат{" "}
              <strong className="text-text">
                изключително информативен характер
              </strong>
              .
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Спести <strong className="text-text">не е</strong> лицензиран
                финансов съветник, застрахователен брокер или енергиен консултант.
              </li>
              <li>
                Резултатите от калкулаторите не представляват оферта, препоръка
                или съвет за действие.
              </li>
              <li>
                Цените и тарифите могат да се различават от действителните при
                вашия доставчик поради регионални различия, промоции или
                актуализации.
              </li>
              <li>
                Винаги проверявайте крайната цена директно при доставчика преди
                да вземете финансово решение.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              3. Ограничение на отговорността
            </h2>
          </div>
          <div className="space-y-3 pl-7 text-sm text-muted">
            <p>
              Екипът на Спести полага разумни усилия за точността на данните, но{" "}
              <strong className="text-text">
                не гарантира пълнота, актуалност или безгрешност
              </strong>{" "}
              на представената информация.
            </p>
            <p>
              Спести не носи отговорност за решения, взети на база информацията
              от платформата, включително, но не само: смяна на доставчик,
              избор на кредит, застраховка или телекомуникационен план.
            </p>
            <p>
              Ползването на платформата е на ваш собствен риск. При съмнение
              относно конкретна тарифа или оферта, обърнете се към съответния
              доставчик или регулатор.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              4. Промени в условията
            </h2>
          </div>
          <div className="space-y-3 pl-7 text-sm text-muted">
            <p>
              Запазваме правото да актуализираме тези условия при необходимост.
              Датата на последна актуализация е посочена в началото на страницата.
              Продължавайки да използвате платформата, вие приемате актуалните
              условия.
            </p>
          </div>
        </section>

        {/* Contact */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Контакт</h2>
          </div>
          <p className="mt-2 text-sm text-muted">
            За въпроси относно условията:{" "}
            <a
              href="mailto:info@spesti.app"
              className="text-primary underline"
            >
              info@spesti.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
