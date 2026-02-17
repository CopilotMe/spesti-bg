"use client";

import { useState, useMemo } from "react";
import { Fuel, ExternalLink, Share2, Check, TrendingDown, Radio } from "lucide-react";
import { calculateFuelCosts } from "@/lib/calculators/fuel";
import { fuelTypeLabels } from "@/data/fuel";
import { formatCurrency } from "@/lib/utils";
import { refUrl } from "@/lib/ref";
import type { FuelType } from "@/lib/types";
import type { FuelPriceData } from "@/lib/api";
import { ProviderComparisonBar } from "@/components/charts/ProviderComparisonBar";

/** Maps our FuelType to Fuelo.net fuel key */
const FUEL_TO_LIVE: Record<FuelType, keyof Omit<FuelPriceData, "date"> | null> = {
  A95: "gasoline",
  A98: null, // fuelo.net doesn't separate A98
  diesel: "diesel",
  lpg: "lpg",
};

const LIVE_FUEL_LABELS: Record<string, string> = {
  gasoline: "Бензин A95",
  diesel: "Дизел",
  lpg: "Автогаз (LPG)",
};

interface FuelComparisonProps {
  livePrices?: FuelPriceData | null;
}

export function FuelComparison({ livePrices }: FuelComparisonProps) {
  const [fuelType, setFuelType] = useState<FuelType>("A95");
  const [monthlyLiters, setMonthlyLiters] = useState(80);
  const [sharedIdx, setSharedIdx] = useState<number | null>(null);

  const results = useMemo(
    () => calculateFuelCosts({ fuelType, monthlyLiters }),
    [fuelType, monthlyLiters]
  );

  const chartData = results.map((r) => ({
    name: r.station.chainName,
    total: r.monthlyCost,
    isCheapest: r.isCheapest,
  }));

  const cheapest = results[0];
  const mostExpensive = results[results.length - 1];
  const yearlySaving =
    cheapest && mostExpensive
      ? (mostExpensive.monthlyCost - cheapest.monthlyCost) * 12
      : 0;

  // Live price for current fuel type
  const liveKey = FUEL_TO_LIVE[fuelType];
  const livePrice = livePrices && liveKey ? livePrices[liveKey] : null;

  async function handleShare(idx: number) {
    const r = results[idx];
    const text = `${r.station.chainName}: ${r.pricePerLiter.toFixed(2)} €/л ${fuelTypeLabels[fuelType]} = ${formatCurrency(r.monthlyCost)}/мес | spesti.app/goriva`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setSharedIdx(idx);
        setTimeout(() => setSharedIdx(null), 2000);
      }
    } catch { /* user cancelled */ }
  }

  return (
    <div className="space-y-6">
      {/* Live prices banner */}
      {livePrices && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              Средни цени на горивата в България — на живо
            </span>
            <span className="ml-auto text-xs text-emerald-600/70">
              fuelo.net • {livePrices.date}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["gasoline", "diesel", "lpg"] as const).map((fuel) => {
              const price = livePrices[fuel];
              if (price === null) return null;
              return (
                <div
                  key={fuel}
                  className="rounded-xl border border-emerald-200 bg-white p-3 text-center"
                >
                  <p className="text-xs text-muted mb-1">{LIVE_FUEL_LABELS[fuel]}</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {price.toFixed(2)} <span className="text-sm font-normal">€/л</span>
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">
                    {(price * 1.95583).toFixed(2)} лв./л
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <Fuel className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text">Вид гориво и потребление</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Вид гориво</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(fuelTypeLabels) as [FuelType, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFuelType(key)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    fuelType === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted hover:border-primary/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="fuel-liters" className="mb-1 block text-sm font-medium text-muted">
              Месечно потребление: {monthlyLiters} литра
            </label>
            <input
              id="fuel-liters"
              type="range"
              value={monthlyLiters}
              onChange={(e) => setMonthlyLiters(Number(e.target.value))}
              min={20}
              max={400}
              step={10}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>20 л</span>
              <span>200 л</span>
              <span>400 л</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live vs static comparison hint */}
      {livePrice !== null && cheapest && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3">
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Средна цена за {fuelTypeLabels[fuelType]}:</strong>{" "}
            {livePrice.toFixed(2)} €/л (fuelo.net, {livePrices?.date}).
            Най-евтината верига в нашия справочник ({cheapest.station.chainName}) предлага{" "}
            {cheapest.pricePerLiter.toFixed(2)} €/л.
            {cheapest.pricePerLiter < livePrice
              ? ` Спестяваш ${((livePrice - cheapest.pricePerLiter) * monthlyLiters).toFixed(2)} € месечно спрямо средната цена.`
              : " Цените в справочника са ориентировъчни и могат да се различават от текущите."}
          </p>
        </div>
      )}

      {/* Savings summary */}
      {cheapest && yearlySaving > 0 && (
        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted">
              Избирайки <strong className="text-primary">{cheapest.station.chainName}</strong> вместо
              най-скъпия, спестяваш
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-primary">
            {formatCurrency(yearlySaving)} годишно
          </p>
        </div>
      )}

      {/* Results table */}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left font-medium text-muted">Верига</th>
              <th className="px-4 py-3 text-right font-medium text-muted">Цена/литър</th>
              <th className="px-4 py-3 text-right font-medium text-muted">Месечно</th>
              <th className="px-4 py-3 text-right font-medium text-muted">Годишно</th>
              <th className="px-4 py-3 text-right font-medium text-muted">Разлика</th>
              <th className="px-4 py-3 text-center font-medium text-muted">Карта</th>
              <th className="px-4 py-3 text-center font-medium text-muted">Оферта</th>
              <th className="px-4 py-3 text-center font-medium text-muted">Сподели</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={r.station.id}
                className={`border-b border-border ${
                  r.isCheapest ? "bg-primary/5" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-text">
                  {r.station.chainName}
                  {r.isCheapest && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                      Най-евтин
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-bold text-text">
                  {r.pricePerLiter.toFixed(2)} €
                </td>
                <td className="px-4 py-3 text-right text-text">
                  {formatCurrency(r.monthlyCost)}
                </td>
                <td className="px-4 py-3 text-right text-text">
                  {formatCurrency(r.yearlyCost)}
                </td>
                <td className="px-4 py-3 text-right">
                  {r.isCheapest ? (
                    <span className="text-primary font-medium">—</span>
                  ) : (
                    <span className="text-red-500">
                      +{formatCurrency(r.differenceFromCheapest)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-xs text-muted">
                  {r.station.hasLoyalty ? (
                    <span className="text-primary">-{r.station.loyaltyDiscount} цент</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {r.station.url ? (
                    <a
                      href={refUrl(r.station.url, "fuel")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                        r.isCheapest
                          ? "bg-primary text-white hover:bg-primary-dark"
                          : "bg-gray-100 text-muted hover:bg-gray-200"
                      }`}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Оферта
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleShare(i)}
                    className="rounded-full p-1.5 text-muted hover:bg-gray-100 hover:text-primary transition-colors"
                    aria-label={`Сподели ${r.station.chainName}`}
                  >
                    {sharedIdx === i ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Share2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <ProviderComparisonBar
        title={`Сравнение на цените за ${fuelTypeLabels[fuelType]}`}
        data={chartData}
      />

      {/* Info */}
      <p className="text-xs text-muted text-center">
        {livePrices
          ? `Средните цени се обновяват на живо от fuelo.net (${livePrices.date}). Цените по вериги са ориентировъчни и могат да варират по бензиностанции.`
          : "Цените са ориентировъчни и може да варират по бензиностанции."}{" "}
        Отстъпката с карта за лоялност е на литър.
      </p>
    </div>
  );
}
