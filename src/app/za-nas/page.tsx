import type { Metadata } from "next";
import { Shield, Users, BarChart3, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "За Спести – Безплатен сравнител на комунални сметки",
  description:
    "Спести е безплатна платформа за сравнение на комунални сметки в България. Научете повече за нашата мисия и данните.",
  alternates: { canonical: "/za-nas" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-text md:text-3xl">
        За Спести
      </h1>

      <div className="space-y-6 text-text">
        <p className="text-lg text-muted">
          Спести е безплатна платформа, която помага на българските
          потребители да разберат своите комунални сметки и да намерят
          най-изгодните оферти.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <Shield className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-2 font-semibold">Официални данни</h3>
            <p className="text-sm text-muted">
              Всички цени и тарифи са от КЕВР (Комисия за енергийно и водно
              регулиране) и официалните сайтове на доставчиците.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <Users className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-2 font-semibold">За потребителя</h3>
            <p className="text-sm text-muted">
              Без реклами, без скрити интереси. Платформата е създадена, за да
              помага на обикновените хора да спестят от комуналните си сметки.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <BarChart3 className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-2 font-semibold">Прозрачност</h3>
            <p className="text-sm text-muted">
              Показваме ясно от какво се формира всяка сметка. Никакви скрити
              такси, никакви изненади.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <HelpCircle className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-2 font-semibold">Достъпност</h3>
            <p className="text-sm text-muted">
              Всяка такса и термин е обяснен достъпно и разбираемо.
              Платформата е подходяща за всеки, независимо от възрастта.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-primary/5 p-5">
          <h3 className="mb-2 font-semibold text-primary">
            Как актуализираме данните?
          </h3>
          <p className="text-sm text-muted">
            Цените на електроенергията се определят от КЕВР с решение, обикновено
            в сила от 1 юли всяка година. Цените на водата се обновяват в рамките
            на 5-годишни регулаторни периоди. Телекомуникационните планове се
            проверяват ежемесечно от нашия екип. Последна актуализация: Юли 2025.
          </p>
        </div>
      </div>
    </div>
  );
}
