import Link from "next/link";
import { PiggyBank } from "lucide-react";
import messages from "@/messages/bg.json";

const footerLinks = [
  { href: "/elektrichestvo", label: "Ток" },
  { href: "/voda", label: "Вода" },
  { href: "/gaz", label: "Газ" },
  { href: "/internet", label: "Интернет" },
  { href: "/krediti", label: "Кредити" },
  { href: "/zastrahovki", label: "Застраховки" },
  { href: "/kombiniran", label: "Комбиниран" },
  { href: "/za-nas", label: "За нас" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              <span className="font-bold text-text">{messages.site.name}</span>
            </div>
            <p className="text-sm text-muted">
              {messages.footer.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-text">Калкулатори</h4>
            <nav className="grid grid-cols-2 gap-1">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-text">Данни</h4>
            <p className="text-xs text-muted">{messages.footer.dataSource}</p>
            <p className="mt-1 text-xs text-muted">{messages.footer.lastUpdate}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <p className="text-xs text-muted/70">
            {messages.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
