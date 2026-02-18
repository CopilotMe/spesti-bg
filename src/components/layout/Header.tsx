"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, BadgeEuro } from "lucide-react";
import messages from "@/messages/bg.json";

const navLinks = [
  { href: "/elektrichestvo", label: messages.nav.electricity },
  { href: "/voda", label: messages.nav.water },
  { href: "/gaz", label: messages.nav.gas },
  { href: "/internet", label: messages.nav.internet },
  { href: "/goriva", label: messages.nav.fuel },
  { href: "/krediti", label: messages.nav.loans },
  { href: "/zastrahovki", label: messages.nav.insurance },
  { href: "/budget", label: messages.nav.budget },
  { href: "/koshnitsa", label: messages.nav.basket },
  { href: "/bvp", label: messages.nav.gdp },
  { href: "/inflacia", label: messages.nav.inflation },
  { href: "/zaplati", label: messages.nav.salary },
  { href: "/kombiniran", label: messages.nav.combined },
  { href: "/blog", label: "Блог" },
];

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
        <nav className="hidden gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-muted hover:bg-gray-100 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Меню"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <nav className="border-t border-border bg-surface px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-gray-100 hover:text-text"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
