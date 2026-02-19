import Link from "next/link";
import { BadgeEuro } from "lucide-react";
import messages from "@/messages/bg.json";

const footerGroups = [
  {
    title: "Сметки",
    links: [
      { href: "/elektrichestvo", label: "Ток" },
      { href: "/voda", label: "Вода" },
      { href: "/gaz", label: "Газ" },
      { href: "/internet", label: "Интернет" },
      { href: "/goriva", label: "Горива" },
      { href: "/mobilni-planove", label: "Мобилни планове" },
      { href: "/otoplenie", label: "Отопление" },
    ],
  },
  {
    title: "Финанси",
    links: [
      { href: "/krediti", label: "Кредити" },
      { href: "/zastrahovki", label: "Застраховки" },
      { href: "/budget", label: "Бюджет" },
      { href: "/evro-konvertor", label: "Евро конвертор" },
      { href: "/kombiniran", label: "Комбиниран" },
      { href: "/cena-na-truda", label: "Цена на труда" },
    ],
  },
  {
    title: "Анализи",
    links: [
      { href: "/koshnitsa", label: "Кошница" },
      { href: "/bvp", label: "БВП" },
      { href: "/inflacia", label: "Инфлация" },
      { href: "/zaplati", label: "Заплати" },
      { href: "/kupuvatelna-sposobnost", label: "Покупателна сп." },
      { href: "/bulgaria-vs-eu", label: "БГ vs ЕС" },
      { href: "/kachestvo-na-vazduh", label: "Качество на въздуха" },
    ],
  },
];

const infoLinks = [
  { href: "/za-nas", label: "За нас" },
  { href: "/metodologia", label: "Методология" },
  { href: "/poveritelnost", label: "Поверителност" },
  { href: "/usloviya", label: "Условия" },
  { href: "/kontakt", label: "Обратна връзка" },
  { href: "/partnyorstvo", label: "Партньорство" },
  { href: "/blog", label: "Блог" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center gap-2">
              <BadgeEuro className="h-5 w-5 text-primary" />
              <span className="font-bold text-text">{messages.site.name}</span>
            </div>
            <p className="text-sm text-muted">
              {messages.footer.description}
            </p>
            <p className="mt-2 text-xs text-muted">
              {messages.footer.dataSource}
            </p>
            <p className="mt-1 text-xs text-muted">
              {messages.footer.lastUpdate}
            </p>
          </div>

          {/* Grouped link columns */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-sm font-semibold text-text">
                {group.title}
              </p>
              <nav className="flex flex-col gap-1">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          {/* Info / Legal */}
          <div>
            <p className="mb-2 text-sm font-semibold text-text">Информация</p>
            <nav className="flex flex-col gap-1">
              {infoLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <p className="text-xs text-muted">{messages.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
