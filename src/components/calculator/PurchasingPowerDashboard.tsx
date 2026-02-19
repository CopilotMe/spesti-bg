"use client";

import { useState, useMemo, useEffect } from "react";
import { Loader2, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { basketProducts, basketHistory } from "@/data/basket";
import { electricityProviders } from "@/data/electricity";
import { fuelStations } from "@/data/fuel";
import { waterProviders } from "@/data/water";
import { SALARY_CONSTANTS, calculateNetFromGross } from "@/lib/salary";
import { fetchMinimumWages } from "@/lib/api";
import type { MinimumWageData } from "@/lib/api";

/* ---------- Items to compare ---------- */
interface PowerItem {
  id: string;
  name: string;
  unit: string;
  priceEur: number;
  emoji: string;
  color: string;
}

function buildItems(): PowerItem[] {
  const items: PowerItem[] = [];

  // Key basket products
  const picks = [
    { id: "bread-white", emoji: "🍞", color: "#f59e0b" },
    { id: "fresh-milk", emoji: "🥛", color: "#3b82f6" },
    { id: "eggs", emoji: "🥚", color: "#eab308" },
    { id: "chicken", emoji: "🍗", color: "#ef4444" },
    { id: "white-cheese", emoji: "🧀", color: "#f97316" },
    { id: "sunflower-oil", emoji: "🫒", color: "#84cc16" },
    { id: "potatoes", emoji: "🥔", color: "#a3a3a3" },
    { id: "sugar", emoji: "🍬", color: "#ec4899" },
  ];
  picks.forEach(({ id, emoji, color }) => {
    const p = basketProducts.find((b) => b.id === id);
    if (p) items.push({ id: p.id, name: p.name, unit: p.unit, priceEur: p.priceEur, emoji, color });
  });

  // Electricity (average of 3 providers single rate)
  const avgElRate =
    electricityProviders.reduce((s, p) => s + p.singleRate, 0) /
    electricityProviders.length;
  items.push({
    id: "electricity",
    name: "Електричество",
    unit: "kWh",
    priceEur: avgElRate,
    emoji: "⚡",
    color: "#facc15",
  });

  // Water (Sofia)
  const sofiaWater = waterProviders.find((w) => w.id === "sofia");
  if (sofiaWater) {
    items.push({
      id: "water",
      name: "Вода (София)",
      unit: "m³",
      priceEur: sofiaWater.totalRateWithVat,
      emoji: "💧",
      color: "#06b6d4",
    });
  }

  // Fuel A95 (average across chains)
  const fuelPrices = fuelStations
    .map((s) => s.prices.A95)
    .filter((p): p is number => p != null);
  if (fuelPrices.length > 0) {
    const avgFuel = fuelPrices.reduce((a, b) => a + b, 0) / fuelPrices.length;
    items.push({
      id: "fuel",
      name: "Бензин А95",
      unit: "литър",
      priceEur: avgFuel,
      emoji: "⛽",
      color: "#f97316",
    });
  }

  return items;
}

const ITEMS = buildItems();
const MIN_NET = calculateNetFromGross(SALARY_CONSTANTS.minWageEur).netEur;
const AVG_NET = calculateNetFromGross(SALARY_CONSTANTS.avgWageEur).netEur;

export function PurchasingPowerDashboard() {
  const [salary, setSalary] = useState(Math.round(MIN_NET));
  const [wagesData, setWagesData] = useState<MinimumWageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMinimumWages()
      .then((d) => setWagesData(d))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- How many units salary buys ---------- */
  const units = useMemo(
    () =>
      ITEMS.map((item) => ({
        ...item,
        quantity: Math.floor(salary / item.priceEur),
      })),
    [salary],
  );

  const maxQty = Math.max(...units.map((u) => u.quantity), 1);

  /* ---------- Basket trend: salary / basket total ---------- */
  const basketTrend = useMemo(() => {
    return basketHistory.map((h) => {
      const label = h.month.replace("2025-", "").replace("2026-", "");
      const monthNames: Record<string, string> = {
        "06": "Юни 25",
        "07": "Юли 25",
        "08": "Авг 25",
        "09": "Сеп 25",
        "10": "Окт 25",
        "11": "Ное 25",
        "12": "Дек 25",
        "01": "Яну 26",
      };
      return {
        month: monthNames[label] || label,
        baskets: Math.floor(salary / h.totalEur),
      };
    });
  }, [salary]);

  /* ---------- Bar chart data ---------- */
  const barData = useMemo(
    () =>
      units.map((u) => ({
        name: `${u.emoji} ${u.name}`,
        quantity: u.quantity,
        color: u.color,
      })),
    [units],
  );

  return (
    <div className="space-y-8">
      {/* ---- Salary input ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <label className="mb-2 block text-sm font-medium text-text">
          Нетна месечна заплата (EUR)
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-40 rounded-lg border border-gray-300 px-4 py-2.5 text-lg font-semibold text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            min="0"
            step="10"
          />
          <button
            onClick={() => setSalary(Math.round(MIN_NET))}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              salary === Math.round(MIN_NET)
                ? "bg-primary text-white"
                : "border border-border bg-white text-text hover:bg-primary/5"
            }`}
          >
            МРЗ ({Math.round(MIN_NET)} &euro;)
          </button>
          <button
            onClick={() => setSalary(Math.round(AVG_NET))}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              salary === Math.round(AVG_NET)
                ? "bg-primary text-white"
                : "border border-border bg-white text-text hover:bg-primary/5"
            }`}
          >
            Средна ({Math.round(AVG_NET)} &euro;)
          </button>
          <button
            onClick={() => setSalary(1500)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              salary === 1500
                ? "bg-primary text-white"
                : "border border-border bg-white text-text hover:bg-primary/5"
            }`}
          >
            1 500 &euro;
          </button>
        </div>
      </div>

      {/* ---- Hero number ---- */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
        <div className="text-4xl font-bold text-primary md:text-5xl">
          {units.find((u) => u.id === "bread-white")?.quantity.toLocaleString("bg-BG") ?? "—"}
        </div>
        <p className="mt-2 text-muted">
          хляба купува месечна заплата от{" "}
          <strong>{salary.toLocaleString("bg-BG")} &euro;</strong>
        </p>
      </div>

      {/* ---- Product grid ---- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
          >
            <span className="text-3xl">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-text">{item.name}</span>
                <span className="ml-2 text-lg font-bold text-primary">
                  {item.quantity.toLocaleString("bg-BG")}
                </span>
              </div>
              <div className="text-xs text-muted">
                {item.priceEur.toFixed(2)} &euro;/{item.unit}
              </div>
              {/* Visual bar */}
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (item.quantity / maxQty) * 100)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Bar chart ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold text-text">
          Колко единици купува {salary.toLocaleString("bg-BG")} &euro;?
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 120 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12 }}
                width={120}
              />
              <Tooltip
                formatter={(v) => [`${Number(v).toLocaleString("bg-BG")} бр.`, "Количество"]}
              />
              <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
                {barData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---- MRZ vs Average comparison ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold text-text">
          МРЗ ({Math.round(MIN_NET)} &euro; нето) vs Средна ({Math.round(AVG_NET)} &euro; нето)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="pb-2 pr-3 font-medium">Продукт</th>
                <th className="pb-2 pr-3 font-medium text-right">Цена</th>
                <th className="pb-2 pr-3 font-medium text-right">МРЗ</th>
                <th className="pb-2 font-medium text-right">Средна</th>
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2 pr-3">
                    <span className="mr-1">{item.emoji}</span>
                    {item.name}
                  </td>
                  <td className="py-2 pr-3 text-right text-muted">
                    {item.priceEur.toFixed(2)} &euro;
                  </td>
                  <td className="py-2 pr-3 text-right font-medium text-text">
                    {Math.floor(MIN_NET / item.priceEur).toLocaleString("bg-BG")}
                  </td>
                  <td className="py-2 text-right font-medium text-primary">
                    {Math.floor(AVG_NET / item.priceEur).toLocaleString("bg-BG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Basket trend over time ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold text-text">
          Колко кошници купува заплатата ти? (тренд)
        </h2>
        <p className="mb-4 text-sm text-muted">
          Брой малки потребителски кошници (21 продукта от КНСБ) при заплата{" "}
          {salary.toLocaleString("bg-BG")} &euro;/мес
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={basketTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [`${Number(v)} кошници`, "Бр. кошници"]}
              />
              <Bar dataKey="baskets" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---- EU minimum wages comparison ---- */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-muted">Зареждане на данни от Eurostat...</span>
        </div>
      ) : (
        wagesData && (
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-4 text-lg font-bold text-text">
              Минимална заплата в ЕС
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={wagesData.countries.map((c) => ({
                    country: c.label,
                    wage: c.periods[c.periods.length - 1]?.value ?? 0,
                  }))}
                >
                  <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v) => [`${Number(v).toFixed(0)} €/мес`, "МРЗ"]}
                  />
                  <Bar dataKey="wage" fill="#059669" radius={[4, 4, 0, 0]}>
                    {wagesData.countries.map((c, i) => (
                      <Cell
                        key={i}
                        fill={c.geo === "BG" ? "#059669" : "#d1d5db"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      )}

      {/* ---- Explainer ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-2 text-sm text-muted">
            <h3 className="font-semibold text-text">
              Какво е покупателна способност?
            </h3>
            <p>
              Покупателната способност показва какво количество стоки и услуги
              може да закупи заплатата ти. Тя е по-добър индикатор за стандарта
              на живот от номиналната заплата, защото отчита местните цени.
            </p>
            <p>
              България има най-ниската минимална заплата в ЕС (620 &euro;), но
              и по-ниски цени. Реалната покупателна способност е по-висока от
              номиналното сравнение. Все пак, за много категории (електроника,
              автомобили, горива) цените са близки до европейските.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
