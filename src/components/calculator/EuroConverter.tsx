"use client";

import { useState, useMemo } from "react";
import { ArrowLeftRight, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import {
  basketProducts,
  currentBasketTotal,
  basketLastUpdated,
} from "@/data/basket";

const RATE = 1.95583;

/* ---------- quick conversion presets ---------- */
const PRESETS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

export function EuroConverter() {
  const [amount, setAmount] = useState("100");
  const [direction, setDirection] = useState<"bgn-to-eur" | "eur-to-bgn">(
    "bgn-to-eur",
  );

  const numericAmount = parseFloat(amount) || 0;

  const converted =
    direction === "bgn-to-eur"
      ? numericAmount / RATE
      : numericAmount * RATE;

  /* ---------- price fairness analysis ---------- */
  const fairness = useMemo(() => {
    const items = basketProducts
      .filter((p) => p.previousPriceEur != null)
      .map((p) => {
        const prevEur = p.previousPriceEur!;
        const prevBgn = prevEur * RATE;
        const fairEur = prevEur; // the fair EUR price is simply the previous EUR price
        const actualEur = p.priceEur;
        const diff = actualEur - fairEur;
        const diffPct = fairEur > 0 ? (diff / fairEur) * 100 : 0;
        return {
          ...p,
          prevBgn,
          fairEur,
          actualEur,
          diff,
          diffPct,
        };
      });

    const avgDiffPct =
      items.reduce((s, i) => s + i.diffPct, 0) / items.length;
    const cheaper = items.filter((i) => i.diff < -0.005).length;
    const same = items.filter((i) => Math.abs(i.diff) <= 0.005).length;
    const moreExpensive = items.filter((i) => i.diff > 0.005).length;

    // Previous total basket in EUR
    const prevTotal = basketProducts.reduce(
      (s, p) => s + (p.previousPriceEur ?? p.priceEur),
      0,
    );
    const totalDiff = currentBasketTotal - prevTotal;

    return { items, avgDiffPct, cheaper, same, moreExpensive, prevTotal, totalDiff };
  }, []);

  return (
    <div className="space-y-8">
      {/* ---- Converter section ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {/* Input */}
          <div className="flex-1 w-full">
            <label className="mb-1 block text-xs font-medium text-muted">
              {direction === "bgn-to-eur" ? "Лева (BGN)" : "Евро (EUR)"}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl font-semibold text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              min="0"
              step="0.01"
              inputMode="decimal"
            />
          </div>

          {/* Swap button */}
          <button
            onClick={() =>
              setDirection((d) =>
                d === "bgn-to-eur" ? "eur-to-bgn" : "bgn-to-eur",
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Обърни посоката"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>

          {/* Result */}
          <div className="flex-1 w-full">
            <label className="mb-1 block text-xs font-medium text-muted">
              {direction === "bgn-to-eur" ? "Евро (EUR)" : "Лева (BGN)"}
            </label>
            <div className="w-full rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-xl font-bold text-primary">
              {converted.toFixed(2)}
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-muted">
          Фиксиран курс: 1 EUR = {RATE} BGN &middot; 1 BGN ={" "}
          {(1 / RATE).toFixed(6)} EUR
        </p>
      </div>

      {/* ---- Quick conversions ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold text-text">
          Бързи конверсии
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {PRESETS.map((v) => (
            <div
              key={v}
              className="rounded-lg border border-border bg-white px-3 py-2 text-center"
            >
              <div className="text-sm font-medium text-text">
                {v.toLocaleString("bg-BG")} лв
              </div>
              <div className="text-sm font-bold text-primary">
                {(v / RATE).toFixed(2)} &euro;
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Fairness summary cards ---- */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {fairness.moreExpensive}
          </div>
          <div className="text-sm text-muted">
            продукта поскъпнали
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <div className="text-2xl font-bold text-gray-500">
            {fairness.same}
          </div>
          <div className="text-sm text-muted">
            без промяна
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {fairness.cheaper}
          </div>
          <div className="text-sm text-muted">
            продукта поевтинели
          </div>
        </div>
      </div>

      {/* ---- Average change callout ---- */}
      <div
        className={`flex items-center gap-3 rounded-xl border px-5 py-4 ${
          fairness.avgDiffPct > 0.5
            ? "border-red-200 bg-red-50 text-red-800"
            : fairness.avgDiffPct < -0.5
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-yellow-200 bg-yellow-50 text-yellow-800"
        }`}
      >
        {fairness.avgDiffPct > 0.5 ? (
          <TrendingUp className="h-5 w-5 shrink-0" />
        ) : fairness.avgDiffPct < -0.5 ? (
          <TrendingDown className="h-5 w-5 shrink-0" />
        ) : (
          <Minus className="h-5 w-5 shrink-0" />
        )}
        <div>
          <p className="font-semibold">
            Средна промяна: {fairness.avgDiffPct > 0 ? "+" : ""}
            {fairness.avgDiffPct.toFixed(1)}%
          </p>
          <p className="text-sm opacity-80">
            Кошницата (21 продукта) е {fairness.totalDiff > 0 ? "поскъпнала" : "поевтиняла"} с{" "}
            {Math.abs(fairness.totalDiff).toFixed(2)} &euro; спрямо предходния месец (
            {fairness.prevTotal.toFixed(2)} &euro; → {currentBasketTotal.toFixed(2)} &euro;)
          </p>
        </div>
      </div>

      {/* ---- Product table ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold text-text">
          Честни ли са новите цени? (21 продукта от кошницата)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="pb-2 pr-3 font-medium">Продукт</th>
                <th className="pb-2 pr-3 font-medium text-right">
                  Преди (EUR)
                </th>
                <th className="pb-2 pr-3 font-medium text-right">
                  Сега (EUR)
                </th>
                <th className="pb-2 font-medium text-right">Промяна</th>
              </tr>
            </thead>
            <tbody>
              {fairness.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2 pr-3">
                    <span className="font-medium text-text">{item.name}</span>
                    <span className="ml-1 text-xs text-muted">
                      /{item.unit}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-right text-muted">
                    {item.fairEur.toFixed(2)}
                  </td>
                  <td className="py-2 pr-3 text-right font-medium text-text">
                    {item.actualEur.toFixed(2)}
                  </td>
                  <td className="py-2 text-right">
                    {Math.abs(item.diffPct) < 0.5 ? (
                      <span className="text-gray-500">0%</span>
                    ) : item.diffPct > 0 ? (
                      <span className="font-medium text-red-600">
                        +{item.diffPct.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="font-medium text-green-600">
                        {item.diffPct.toFixed(1)}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          Данни от КНСБ, актуализирани на {basketLastUpdated}. Сравнение на
          текущи цени спрямо предходния месец.
        </p>
      </div>

      {/* ---- Explainer ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-2 text-sm text-muted">
            <h3 className="font-semibold text-text">
              Какво е фиксираният курс?
            </h3>
            <p>
              От 1 януари 2026 г. България прие еврото. Фиксираният курс е{" "}
              <strong>1 EUR = 1.95583 BGN</strong> (същият като борда). Всички
              цени в левове се конвертират по този курс и закръглянето може да
              бъде максимум до 1 евроцент.
            </p>
            <p>
              Този инструмент сравнява текущите цени в евро с предходния месец, за
              да покаже кои продукти са поскъпнали реално и кои просто са
              конвертирани. Промяните могат да се дължат както на закръгляне,
              така и на сезонни фактори и инфлация.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
