import type { Metadata } from "next";
import { Shield, Eye, Server, Cookie, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Политика за поверителност – Спести",
  description:
    "Как Спести обработва вашите данни. Кратко: не събираме лични данни. Без регистрация, без тракери, без реклами.",
  alternates: { canonical: "/poveritelnost" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-text md:text-3xl">
        Политика за поверителност
      </h1>
      <p className="mb-8 text-sm text-muted">
        Последна актуализация: 16 февруари 2026 г.
      </p>

      <div className="space-y-8 text-text">
        {/* Intro */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="mb-1 font-semibold text-primary">Накратко</h2>
              <p className="text-sm text-muted">
                Спести не събира, не съхранява и не продава лични данни. Не
                изискваме регистрация. Не използваме рекламни тракери. Всичко,
                което въведете в калкулаторите, остава само на вашето устройство.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              1. Какви данни събираме
            </h2>
          </div>
          <div className="space-y-3 pl-7 text-sm text-muted">
            <p>
              <strong className="text-text">Лични данни:</strong> Никакви.
              Спести не изисква регистрация, имейл, име или каквито и да е лични
              данни. Калкулаторите работят изцяло в браузъра ви.
            </p>
            <p>
              <strong className="text-text">Данни за потребление:</strong>{" "}
              Стойностите, които въвеждате (kWh, m&sup3;, лв.), се обработват
              локално на вашето устройство и не се изпращат към наши сървъри.
            </p>
            <p>
              <strong className="text-text">Аналитични данни:</strong> Използваме
              анонимна уеб аналитика без бисквитки (cookie-free), която отчита
              само общ брой посещения на страници. Не проследяваме отделни
              потребители и не създаваме профили.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              2. Бисквитки (Cookies)
            </h2>
          </div>
          <div className="space-y-3 pl-7 text-sm text-muted">
            <p>
              Спести не използва бисквитки за проследяване или реклама. Възможно
              е да се използват само технически необходими бисквитки (напр. за
              предотвратяване на CSRF атаки), които не съдържат лични данни.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              3. Външни услуги
            </h2>
          </div>
          <div className="space-y-3 pl-7 text-sm text-muted">
            <p>
              За актуални данни Спести прави заявки към публичните API-та на{" "}
              <strong className="text-text">Eurostat</strong> (статистическата
              служба на ЕС) и{" "}
              <strong className="text-text">Европейската централна банка</strong>.
              Тези заявки не съдържат никакви лични данни — изпращат се само
              стандартни HTTP заглавки (headers).
            </p>
            <p>
              Сайтът е хостван на{" "}
              <strong className="text-text">Vercel</strong> (САЩ/ЕС), които
              обработват стандартни сървърни логове (IP адрес, User-Agent) съгласно
              техните условия за ползване. Ние нямаме достъп до тези логове.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              4. Вашите права по GDPR
            </h2>
          </div>
          <div className="space-y-3 pl-7 text-sm text-muted">
            <p>
              Тъй като не събираме лични данни, правата по GDPR за достъп,
              коригиране, изтриване и преносимост на данни се прилагат
              автоматично — няма какво да изтриваме, защото нямаме какво да
              съхраняваме.
            </p>
            <p>
              Ако имате въпроси относно поверителността, можете да се свържете с
              нас на адреса по-долу.
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
            За въпроси относно поверителността:{" "}
            <a
              href="mailto:privacy@spesti.app"
              className="text-primary underline"
            >
              privacy@spesti.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
