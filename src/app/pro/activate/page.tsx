"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Sparkles,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  activateProWithCode,
  isProActive,
  PRO_PAYMENT_URL,
  PRO_PRICE,
} from "@/lib/features";

export default function ProActivatePage() {
  const [alreadyActive, setAlreadyActive] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAlreadyActive(isProActive());
  }, []);

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setError("");

    const result = await activateProWithCode(code.trim());

    if (result.success) {
      setActivated(true);
    } else {
      setError(result.error || "Невалиден код");
    }

    setLoading(false);
  }

  // Already active or just activated — show success
  if (alreadyActive || activated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>

        <h1 className="mb-3 text-2xl font-bold text-text">
          Spesti Pro е активиран!
        </h1>

        <p className="mb-6 text-muted">
          Благодарим ти за подкрепата! Вече имаш достъп до всички Pro функции,
          включително PDF експорт на калкулаторите.
        </p>

        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Pro статусът е записан на това устройство
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-text">Пробвай PDF експорт:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/budget", label: "Семеен бюджет" },
              { href: "/zaplati", label: "Заплати" },
              { href: "/inflacia", label: "Инфлация" },
              { href: "/koshnitsa", label: "Кошница" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-muted">
          Pro статусът се запазва в браузъра ти. Ако смениш устройство или
          изтриеш данните на браузъра, използвай кода си отново за реактивация.
        </p>
      </div>
    );
  }

  // Not active — show activation form
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
        <Sparkles className="h-10 w-10 text-amber-600" />
      </div>

      <h1 className="mb-3 text-2xl font-bold text-text">
        Активирай Spesti Pro
      </h1>

      <p className="mb-8 text-muted">
        PDF експорт на всички калкулатори — еднократно за{" "}
        <strong>{PRO_PRICE}</strong>
      </p>

      {/* Step 1: Pay */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-left">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            1
          </span>
          <h2 className="text-lg font-semibold text-text">
            Плати {PRO_PRICE} чрез Revolut
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted">
          Натисни бутона по-долу и плати {PRO_PRICE} чрез Revolut. След
          плащането ще получиш активационен код.
        </p>
        <a
          href={PRO_PAYMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0666eb] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0555cc]"
        >
          Плати с Revolut
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Step 2: Enter code */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-left">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            2
          </span>
          <h2 className="text-lg font-semibold text-text">
            Въведи активационен код
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted">
          След плащането ще получиш код (напр. SPESTI-1234). Въведи го тук:
        </p>

        <form onSubmit={handleActivate} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="SPESTI-1234"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg font-mono tracking-widest placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />

          {error && (
            <p className="flex items-center justify-center gap-1.5 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Проверка...
              </span>
            ) : (
              "Активирай Pro"
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-muted">
        Няма абонамент. Плащаш веднъж и имаш Pro завинаги на това устройство.
      </p>
    </div>
  );
}
