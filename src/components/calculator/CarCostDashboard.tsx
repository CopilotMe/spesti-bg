"use client";

import { useState, useMemo } from "react";
import {
  Car,
  Fuel,
  ShieldCheck,
  Wrench,
  TrendingDown,
  Info,
  Bus,
  BatteryCharging,
  Receipt,
  Coins,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { insuranceProducts } from "@/data/insurance";
import { loanProducts } from "@/data/loans";

// ── Constants ───────────────────────────────────────────────────────────────
const FUEL_PRICES: Record<string, number> = {
  gasoline: 1.3,
  diesel: 1.35,
  lpg: 0.72,
};
const ELECTRICITY_RATE = 0.163; // EUR/kWh with VAT

const FUEL_CONSUMPTION: Record<string, number> = {
  gasoline: 7.5, // L/100km
  diesel: 6.0,
  lpg: 9.5,
  electric: 17, // kWh/100km
};

const ROAD_TAX: Record<string, number> = {
  small: 30, // EUR/year
  medium: 65,
  large: 130,
};

const VIGNETTE_ANNUAL = 48.57; // EUR
const TECH_INSPECTION = 49.16; // EUR/year
const MAINTENANCE_PER_KM = 0.03; // EUR/km
const DEPRECIATION_RATE = 0.15; // 15% per year

// ── Types ───────────────────────────────────────────────────────────────────
type FuelType = "gasoline" | "diesel" | "lpg" | "electric";
type EnginePower = "small" | "medium" | "large";

const FUEL_OPTIONS: { key: FuelType; label: string; icon: string }[] = [
  { key: "gasoline", label: "Бензин", icon: "⛽" },
  { key: "diesel", label: "Дизел", icon: "🛢" },
  { key: "lpg", label: "LPG", icon: "🔵" },
  { key: "electric", label: "Електро", icon: "🔋" },
];

const ENGINE_OPTIONS: { key: EnginePower; label: string }[] = [
  { key: "small", label: "до 55 kW" },
  { key: "medium", label: "55-120 kW" },
  { key: "large", label: "над 120 kW" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

// ── Component ───────────────────────────────────────────────────────────────
export function CarCostDashboard() {
  const [fuelType, setFuelType] = useState<FuelType>("gasoline");
  const [kmPerMonth, setKmPerMonth] = useState(1000);
  const [carValue, setCarValue] = useState(10000);
  const [enginePower, setEnginePower] = useState<EnginePower>("medium");
  const [includeKasko, setIncludeKasko] = useState(false);
  const [isFinanced, setIsFinanced] = useState(false);
  const [loanTermMonths, setLoanTermMonths] = useState(60);

  const calculations = useMemo(() => {
    // Fuel cost
    const monthlyFuelCost =
      fuelType === "electric"
        ? (kmPerMonth / 100) * 17 * ELECTRICITY_RATE
        : (kmPerMonth / 100) *
          FUEL_CONSUMPTION[fuelType] *
          FUEL_PRICES[fuelType];

    // Insurance — GO (mandatory)
    const goProducts = insuranceProducts.filter((p) => p.type === "go");
    const monthlyGO = avg(goProducts.map((p) => p.monthlyPremium));

    // Insurance — KASKO (optional)
    const kaskoProducts = insuranceProducts.filter((p) => p.type === "kasko");
    const monthlyKasko = includeKasko
      ? avg(kaskoProducts.map((p) => p.monthlyPremium))
      : 0;

    // Taxes & fees
    const monthlyRoadTax = ROAD_TAX[enginePower] / 12;
    const monthlyVignette = VIGNETTE_ANNUAL / 12;
    const monthlyInspection = TECH_INSPECTION / 12;

    // Maintenance & depreciation
    const monthlyMaintenance = kmPerMonth * MAINTENANCE_PER_KM;
    const monthlyDepreciation = (carValue * DEPRECIATION_RATE) / 12;

    // Loan (annuity)
    let monthlyLoan = 0;
    if (isFinanced) {
      const consumerLoans = loanProducts.filter((l) => l.type === "consumer");
      const avgAnnualRate = avg(consumerLoans.map((l) => l.interestRate));
      const avgRate = avgAnnualRate / 100 / 12;
      if (avgRate > 0 && loanTermMonths > 0) {
        const factor = Math.pow(1 + avgRate, loanTermMonths);
        monthlyLoan = carValue * ((avgRate * factor) / (factor - 1));
      }
    }

    const totalMonthly =
      monthlyFuelCost +
      monthlyGO +
      monthlyKasko +
      monthlyRoadTax +
      monthlyVignette +
      monthlyInspection +
      monthlyMaintenance +
      monthlyDepreciation +
      monthlyLoan;

    const totalAnnual = totalMonthly * 12;

    return {
      monthlyFuelCost,
      monthlyGO,
      monthlyKasko,
      monthlyRoadTax,
      monthlyVignette,
      monthlyInspection,
      monthlyMaintenance,
      monthlyDepreciation,
      monthlyLoan,
      totalMonthly,
      totalAnnual,
    };
  }, [fuelType, kmPerMonth, carValue, enginePower, includeKasko, isFinanced, loanTermMonths]);

  // ── Pie chart data ──────────────────────────────────────────────────────
  const pieData = useMemo(() => {
    const items: { name: string; value: number; color: string }[] = [
      { name: "Гориво", value: calculations.monthlyFuelCost, color: "#10b981" },
      { name: "ГО застраховка", value: calculations.monthlyGO, color: "#3b82f6" },
    ];

    if (includeKasko) {
      items.push({
        name: "КАСКО",
        value: calculations.monthlyKasko,
        color: "#8b5cf6",
      });
    }

    items.push(
      { name: "Данък", value: calculations.monthlyRoadTax, color: "#f59e0b" },
      { name: "Винетка", value: calculations.monthlyVignette, color: "#f97316" },
      { name: "ГТП", value: calculations.monthlyInspection, color: "#ec4899" },
      { name: "Поддръжка", value: calculations.monthlyMaintenance, color: "#6366f1" },
      { name: "Амортизация", value: calculations.monthlyDepreciation, color: "#94a3b8" },
    );

    if (isFinanced) {
      items.push({
        name: "Кредит",
        value: calculations.monthlyLoan,
        color: "#ef4444",
      });
    }

    return items;
  }, [calculations, includeKasko, isFinanced]);

  // ── Breakdown table rows ────────────────────────────────────────────────
  const breakdownRows = useMemo(() => {
    const rows: { category: string; monthly: number; annual: number; pct: number }[] = [];
    const total = calculations.totalMonthly;

    const addRow = (category: string, monthly: number) => {
      rows.push({
        category,
        monthly,
        annual: monthly * 12,
        pct: total > 0 ? (monthly / total) * 100 : 0,
      });
    };

    addRow("Гориво", calculations.monthlyFuelCost);
    addRow("ГО застраховка", calculations.monthlyGO);
    if (includeKasko) addRow("КАСКО", calculations.monthlyKasko);
    addRow("Данък", calculations.monthlyRoadTax);
    addRow("Винетка", calculations.monthlyVignette);
    addRow("ГТП", calculations.monthlyInspection);
    addRow("Поддръжка", calculations.monthlyMaintenance);
    addRow("Амортизация", calculations.monthlyDepreciation);
    if (isFinanced) addRow("Кредит", calculations.monthlyLoan);

    return rows;
  }, [calculations, includeKasko, isFinanced]);

  // ── Comparison alternatives ─────────────────────────────────────────────
  const taxiMonthly = kmPerMonth * 0.5;
  const publicTransportMonthly = 25;

  return (
    <div className="space-y-6">
      {/* ── 1. Fuel type selector ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {FUEL_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFuelType(opt.key)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              fuelType === opt.key
                ? "bg-primary text-white border-primary"
                : "border-border bg-surface text-text hover:bg-primary/10"
            }`}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      {/* ── 2. Input controls ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* km per month */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            <Car className="mr-1 inline h-4 w-4" />
            km/месец
          </label>
          <input
            type="number"
            min={100}
            max={5000}
            value={kmPerMonth}
            onChange={(e) =>
              setKmPerMonth(
                Math.min(5000, Math.max(100, Number(e.target.value)))
              )
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          />
        </div>

        {/* Car value */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            <Coins className="mr-1 inline h-4 w-4" />
            Стойност на колата (&euro;)
          </label>
          <input
            type="number"
            min={1000}
            max={100000}
            value={carValue}
            onChange={(e) =>
              setCarValue(
                Math.min(100000, Math.max(1000, Number(e.target.value)))
              )
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          />
        </div>

        {/* Engine power */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            <BatteryCharging className="mr-1 inline h-4 w-4" />
            Мощност
          </label>
          <select
            value={enginePower}
            onChange={(e) => setEnginePower(e.target.value as EnginePower)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          >
            {ENGINE_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Include KASKO */}
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
          <input
            type="checkbox"
            checked={includeKasko}
            onChange={(e) => setIncludeKasko(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <ShieldCheck className="h-4 w-4 text-muted" />
          Включи КАСКО
        </label>

        {/* Is financed */}
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
          <input
            type="checkbox"
            checked={isFinanced}
            onChange={(e) => setIsFinanced(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <Receipt className="h-4 w-4 text-muted" />
          На кредит
        </label>

        {/* Loan term — conditionally rendered */}
        {isFinanced && (
          <div>
            <label className="mb-1 block text-sm font-medium text-text">
              Срок на кредита (месеци)
            </label>
            <input
              type="number"
              min={6}
              max={120}
              value={loanTermMonths}
              onChange={(e) =>
                setLoanTermMonths(
                  Math.min(120, Math.max(6, Number(e.target.value)))
                )
              }
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
            />
          </div>
        )}
      </div>

      {/* ── 3. Hero card — total monthly cost ──────────────────────────── */}
      <div className="rounded-xl border border-primary bg-primary/5 p-6 text-center">
        <p className="text-sm font-medium text-muted">
          Обща месечна цена на притежание
        </p>
        <p className="mt-1 text-4xl font-bold text-primary">
          {calculations.totalMonthly.toFixed(2)} &euro;/месец
        </p>
        <p className="mt-1 text-lg text-muted">
          {calculations.totalAnnual.toFixed(2)} &euro;/годишно
        </p>
      </div>

      {/* ── 4. Pie chart — cost breakdown ──────────────────────────────── */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 font-semibold text-text">
          <Fuel className="mr-1 inline h-5 w-5 text-primary" />
          Разпределение на разходите
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${Number(value).toFixed(2)} \u20AC`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ── 5. Breakdown table ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-surface p-5 overflow-x-auto">
        <h2 className="mb-3 font-semibold text-text">
          <TrendingDown className="mr-1 inline h-5 w-5 text-primary" />
          Детайлна разбивка
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2 pr-4">Категория</th>
              <th className="py-2 pr-4 text-right">Месечно (&euro;)</th>
              <th className="py-2 pr-4 text-right">Годишно (&euro;)</th>
              <th className="py-2 text-right">% от общо</th>
            </tr>
          </thead>
          <tbody>
            {breakdownRows.map((row) => (
              <tr
                key={row.category}
                className="border-b border-border last:border-0"
              >
                <td className="py-2 pr-4 text-text">{row.category}</td>
                <td className="py-2 pr-4 text-right text-text">
                  {row.monthly.toFixed(2)}
                </td>
                <td className="py-2 pr-4 text-right text-text">
                  {row.annual.toFixed(2)}
                </td>
                <td className="py-2 text-right text-muted">
                  {row.pct.toFixed(1)}%
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr className="border-t-2 border-border font-bold">
              <td className="py-2 pr-4 text-text">Общо</td>
              <td className="py-2 pr-4 text-right text-primary">
                {calculations.totalMonthly.toFixed(2)}
              </td>
              <td className="py-2 pr-4 text-right text-primary">
                {calculations.totalAnnual.toFixed(2)}
              </td>
              <td className="py-2 text-right text-muted">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 6. Comparison section ──────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-4 font-semibold text-text">
          Твоята кола vs Алтернативи
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Your car */}
          <div className="rounded-xl border border-primary bg-primary/5 p-4 text-center">
            <Car className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 text-sm font-medium text-text">Твоята кола</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {calculations.totalMonthly.toFixed(2)} &euro;
            </p>
            <p className="text-xs text-muted">/месец</p>
          </div>

          {/* Taxi */}
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <span className="mx-auto block text-3xl">🚕</span>
            <p className="mt-2 text-sm font-medium text-text">Такси</p>
            <p className="mt-1 text-2xl font-bold text-text">
              {taxiMonthly.toFixed(2)} &euro;
            </p>
            <p className="text-xs text-muted">/месец (ср. 0.50 &euro;/km)</p>
          </div>

          {/* Public transport */}
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <Bus className="mx-auto h-8 w-8 text-emerald-500" />
            <p className="mt-2 text-sm font-medium text-text">
              Градски транспорт
            </p>
            <p className="mt-1 text-2xl font-bold text-text">
              {publicTransportMonthly.toFixed(2)} &euro;
            </p>
            <p className="text-xs text-muted">/месец (месечна карта)</p>
          </div>
        </div>
      </div>

      {/* ── 7. Methodology note ────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted space-y-1">
            <p>
              <strong className="text-text">Методология:</strong> Изчислението
              използва средни стойности за България. Цени на горивата: бензин{" "}
              {FUEL_PRICES.gasoline.toFixed(2)} &euro;/L, дизел{" "}
              {FUEL_PRICES.diesel.toFixed(2)} &euro;/L, LPG{" "}
              {FUEL_PRICES.lpg.toFixed(2)} &euro;/L, ток{" "}
              {ELECTRICITY_RATE.toFixed(3)} &euro;/kWh.
            </p>
            <p>
              Разход: бензин {FUEL_CONSUMPTION.gasoline} L/100km, дизел{" "}
              {FUEL_CONSUMPTION.diesel} L/100km, LPG {FUEL_CONSUMPTION.lpg}{" "}
              L/100km, електро {FUEL_CONSUMPTION.electric} kWh/100km.
            </p>
            <p>
              ГО и КАСКО са средни стойности от{" "}
              {insuranceProducts.filter((p) => p.type === "go").length}{" "}
              застрахователи. Кредитната вноска е с анюитетна формула при средна
              лихва от{" "}
              {(
                avg(
                  loanProducts
                    .filter((l) => l.type === "consumer")
                    .map((l) => l.interestRate)
                )
              ).toFixed(2)}
              % годишно. Амортизация: {(DEPRECIATION_RATE * 100).toFixed(0)}%
              годишно. Винетка: {VIGNETTE_ANNUAL.toFixed(2)} &euro;/год. ГТП:{" "}
              {TECH_INSPECTION.toFixed(2)} &euro;/год.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
