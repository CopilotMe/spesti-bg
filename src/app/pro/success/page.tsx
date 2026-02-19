"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Sparkles } from "lucide-react";
import { activatePro, isProActive } from "@/lib/features";

export default function ProSuccessPage() {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    activatePro();
    setActivated(isProActive());
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle className="h-10 w-10 text-primary" />
      </div>

      <h1 className="mb-3 text-2xl font-bold text-text">
        Spesti Pro e активиран!
      </h1>

      <p className="mb-6 text-muted">
        Благодарим ти за подкрепата! Вече имаш достъп до всички Pro функции,
        включително PDF експорт на калкулаторите.
      </p>

      {activated && (
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Pro статусът е записан на това устройство
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium text-text">Пробвай PDF експорт:</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/budget"
            className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Семеен бюджет
          </Link>
          <Link
            href="/zaplati"
            className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Заплати
          </Link>
          <Link
            href="/inflacia"
            className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Инфлация
          </Link>
          <Link
            href="/koshnitsa"
            className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Кошница
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-muted">
        Pro статусът се запазва в браузъра ти. Ако смениш устройство или
        изтриеш данните на браузъра, посети тази страница отново за да
        реактивираш.
      </p>
    </div>
  );
}
