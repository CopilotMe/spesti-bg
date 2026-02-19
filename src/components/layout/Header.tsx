"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, BadgeEuro, ChevronDown } from "lucide-react";
import messages from "@/messages/bg.json";

const navGroups = [
  {
    label: messages.nav.groups.bills,
    links: [
      { href: "/elektrichestvo", label: messages.nav.electricity },
      { href: "/voda", label: messages.nav.water },
      { href: "/gaz", label: messages.nav.gas },
      { href: "/internet", label: messages.nav.internet },
      { href: "/goriva", label: messages.nav.fuel },
      { href: "/mobilni-planove", label: messages.nav.mobilePlans },
    ],
  },
  {
    label: messages.nav.groups.finance,
    links: [
      { href: "/krediti", label: messages.nav.loans },
      { href: "/zastrahovki", label: messages.nav.insurance },
      { href: "/budget", label: messages.nav.budget },
      { href: "/evro-konvertor", label: messages.nav.euroConverter },
    ],
  },
  {
    label: messages.nav.groups.analysis,
    links: [
      { href: "/koshnitsa", label: messages.nav.basket },
      { href: "/bvp", label: messages.nav.gdp },
      { href: "/inflacia", label: messages.nav.inflation },
      { href: "/zaplati", label: messages.nav.salary },
      { href: "/kupuvatelna-sposobnost", label: messages.nav.purchasingPower },
      { href: "/bulgaria-vs-eu", label: messages.nav.euComparison },
    ],
  },
];

function DesktopDropdown({
  group,
}: {
  group: (typeof navGroups)[number];
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-text"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {group.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-border bg-surface py-2 shadow-lg">
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-sm text-muted transition-colors hover:bg-gray-100 hover:text-text"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BadgeEuro className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-text">
            {messages.site.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основна навигация">
          {navGroups.map((group) => (
            <DesktopDropdown key={group.label} group={group} />
          ))}
          <Link
            href="/kombiniran"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-text"
          >
            {messages.nav.combined}
          </Link>
          <Link
            href="/blog"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-text"
          >
            Блог
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-muted hover:bg-gray-100 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Меню"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <nav
          className="border-t border-border bg-surface px-4 pb-4 lg:hidden"
          aria-label="Основна навигация"
        >
          {navGroups.map((group) => (
            <div key={group.label} className="py-2">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted/60">
                {group.label}
              </p>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-text"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="border-t border-border pt-2">
            <Link
              href="/kombiniran"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-text"
              onClick={() => setIsOpen(false)}
            >
              {messages.nav.combined}
            </Link>
            <Link
              href="/blog"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-text"
              onClick={() => setIsOpen(false)}
            >
              Блог
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
