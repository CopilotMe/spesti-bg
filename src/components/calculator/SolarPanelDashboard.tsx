"use client";

import { useState, useMemo } from "react";
import {
  Sun,
  Zap,
  TrendingUp,
  Calendar,
  Coins,
  Info,
  MapPin,
  Battery,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { electricityProviders } from "@/data/electricity";

// --- Constants ---
const PANEL_COST_PER_KW = 1100; // EUR per kW installed
const PANEL_WATTS_PER_M2 = 200; // W per m² of modern panels
const ANNUAL_PRODUCTION_PER_KW = 1300; // kWh per kW per year (Bulgaria average)
const DEGRADATION_RATE = 0.005; // 0.5% per year
const NET_METERING_RATE = 0.8; // 80% of retail rate for excess sold back
const SYSTEM_LIFETIME = 25; // years
const INVERTER_REPLACEMENT_YEAR = 12;
const INVERTER_COST_RATIO = 0.15; // 15% of system cost
const VAT = 1.2;

interface YearData {
  year: number;
  production: number;
  selfConsumed: number;
  excess: number;
  savings: number;
  cumulativeSavings: number;
}

export function SolarPanelDashboard() {
  const [roofArea, setRoofArea] = useState(30);
  const [region, setRegion] = useState("electrohold");
  const [monthlyBill, setMonthlyBill] = useState(40);
  const [withNetMetering, setWithNetMetering] = useState(true);

  const provider = useMemo(
    () => electricityProviders.find((p) => p.id === region) ?? electricityProviders[0],
    [region],
  );

  const calculations = useMemo(() => {
    const systemSizeKw = (roofArea * PANEL_WATTS_PER_M2) / 1000;
    const systemCost = systemSizeKw * PANEL_COST_PER_KW;
    const rateWithVat = provider.singleRate * VAT;
    const annualConsumptionKwh = (monthlyBill / rateWithVat) * 12;
    const inverterCost = systemCost * INVERTER_COST_RATIO;
    const totalInvestment = systemCost + inverterCost;

    let cumulativeSavings = 0;
    let breakEvenYear: number | null = null;

    const yearData: YearData[] = [];

    for (let year = 0; year < SYSTEM_LIFETIME; year++) {
      const production =
        systemSizeKw * ANNUAL_PRODUCTION_PER_KW * Math.pow(1 - DEGRADATION_RATE, year);
      const selfConsumed = Math.min(production, annualConsumptionKwh);
      const excess = production - selfConsumed;
      const savings =
        selfConsumed * rateWithVat +
        (withNetMetering ? excess * rateWithVat * NET_METERING_RATE : 0);

      cumulativeSavings += savings;

      // Subtract inverter replacement at year 12
      if (year === INVERTER_REPLACEMENT_YEAR) {
        cumulativeSavings -= inverterCost;
      }

      if (breakEvenYear === null && cumulativeSavings >= totalInvestment) {
        breakEvenYear = year + 1; // 1-indexed year
      }

      yearData.push({
        year: year + 1,
        production: Math.round(production),
        selfConsumed: Math.round(selfConsumed),
        excess: Math.round(excess),
        savings: Math.round(savings * 100) / 100,
        cumulativeSavings: Math.round(cumulativeSavings * 100) / 100,
      });
    }

    const twentyFiveYearNet = cumulativeSavings - totalInvestment;
    const firstYearSavings = yearData[0]?.savings ?? 0;
    const annualProduction = Math.round(
      systemSizeKw * ANNUAL_PRODUCTION_PER_KW,
    );

    return {
      systemSizeKw,
      systemCost,
      totalInvestment,
      annualProduction,
      rateWithVat,
      annualConsumptionKwh,
      breakEvenYear,
      twentyFiveYearNet,
      firstYearSavings,
      yearData,
    };
  }, [roofArea, provider, monthlyBill, withNetMetering]);

  const chartData = useMemo(() => {
    return [
      { year: 0, cumulativeSavings: 0, totalInvestment: calculations.totalInvestment },
      ...calculations.yearData.map((d) => ({
        year: d.year,
        cumulativeSavings: Math.round(d.cumulativeSavings),
        totalInvestment: Math.round(calculations.totalInvestment),
      })),
    ];
  }, [calculations]);

  return (
    <div className="space-y-6">
      {/* ---- Input Controls ---- */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <Sun className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text">Параметри на системата</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Roof area */}
          <div className="space-y-2">
            <label htmlFor="roof-area" className="text-sm font-medium text-text">
              Площ на покрива (m²)
            </label>
            <input
              id="roof-area"
              type="number"
              value={roofArea}
              onChange={(e) =>
                setRoofArea(Math.max(10, Math.min(100, Number(e.target.value))))
              }
              min={10}
              max={100}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="range"
              value={roofArea}
              onChange={(e) => setRoofArea(Number(e.target.value))}
              min={10}
              max={100}
              step={1}
              className="w-full accent-primary"
              aria-label="Площ на покрива"
            />
          </div>

          {/* Region / Provider */}
          <div className="space-y-2">
            <label htmlFor="region-select" className="text-sm font-medium text-text">
              <MapPin className="mr-1 inline h-4 w-4" />
              Регион (ЕРП)
            </label>
            <select
              id="region-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {electricityProviders.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.region})
                </option>
              ))}
            </select>
          </div>

          {/* Monthly bill */}
          <div className="space-y-2">
            <label htmlFor="monthly-bill" className="text-sm font-medium text-text">
              Месечна сметка за ток (EUR)
            </label>
            <input
              id="monthly-bill"
              type="number"
              value={monthlyBill}
              onChange={(e) =>
                setMonthlyBill(Math.max(10, Math.min(200, Number(e.target.value))))
              }
              min={10}
              max={200}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="range"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              min={10}
              max={200}
              step={5}
              className="w-full accent-primary"
              aria-label="Месечна сметка за ток"
            />
          </div>

          {/* Net metering toggle */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-text">Нетно отчитане</span>
            <label
              htmlFor="net-metering"
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2"
            >
              <div className="relative">
                <input
                  id="net-metering"
                  type="checkbox"
                  checked={withNetMetering}
                  onChange={(e) => setWithNetMetering(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm text-text">
                {withNetMetering ? "Включено" : "Изключено"}
              </span>
            </label>
            <p className="text-xs text-muted">
              Продажба на излишъка обратно на {(NET_METERING_RATE * 100).toFixed(0)}% от
              цената
            </p>
          </div>
        </div>
      </div>

      {/* ---- 4 Summary Cards ---- */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <Zap className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
          <p className="text-xs text-muted">Мощност на системата</p>
          <p className="text-2xl font-bold text-text">
            {calculations.systemSizeKw.toFixed(1)}{" "}
            <span className="text-sm font-normal text-muted">kW</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <Battery className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
          <p className="text-xs text-muted">Годишно производство</p>
          <p className="text-2xl font-bold text-text">
            {calculations.annualProduction.toLocaleString("bg-BG")}{" "}
            <span className="text-sm font-normal text-muted">kWh</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <Coins className="mx-auto mb-2 h-6 w-6 text-blue-500" />
          <p className="text-xs text-muted">Цена на системата</p>
          <p className="text-2xl font-bold text-text">
            {calculations.systemCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            <span className="text-sm font-normal text-muted">EUR</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <Calendar className="mx-auto mb-2 h-6 w-6 text-purple-500" />
          <p className="text-xs text-muted">Изплащане</p>
          <p className="text-2xl font-bold text-text">
            {calculations.breakEvenYear !== null
              ? `Година ${calculations.breakEvenYear}`
              : "Над 25 год."}
          </p>
        </div>
      </div>

      {/* ---- Line Chart: Cumulative Savings vs Investment ---- */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 font-semibold text-text">
          Кумулативни спестявания vs инвестиция (25 години)
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: "Година", position: "insideBottomRight", offset: -5 }}
              fontSize={12}
            />
            <YAxis
              unit=" EUR"
              fontSize={12}
              tickFormatter={(v: number) => v.toLocaleString("bg-BG")}
            />
            <Tooltip
              formatter={(value, name) => [
                `${Number(value).toLocaleString("bg-BG")} EUR`,
                name,
              ]}
              labelFormatter={(label) => `Година ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="cumulativeSavings"
              name="Кумулативни спестявания"
              stroke="#059669"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="totalInvestment"
              name="Обща инвестиция"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={false}
            />
            {calculations.breakEvenYear !== null && (
              <ReferenceLine
                x={calculations.breakEvenYear}
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: `Изплащане: год. ${calculations.breakEvenYear}`,
                  position: "top",
                  fill: "#8b5cf6",
                  fontSize: 12,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ---- Savings Summary (3 cards) ---- */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <Coins className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="text-xs text-muted">Месечни спестявания (1-ва год.)</p>
          <p className="text-2xl font-bold text-primary">
            {(calculations.firstYearSavings / 12).toFixed(2)}{" "}
            <span className="text-sm font-normal text-muted">EUR/мес.</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <TrendingUp className="mx-auto mb-2 h-5 w-5 text-emerald-600" />
          <p className="text-xs text-muted">Годишни спестявания (1-ва год.)</p>
          <p className="text-2xl font-bold text-emerald-600">
            {calculations.firstYearSavings.toFixed(0)}{" "}
            <span className="text-sm font-normal text-muted">EUR/год.</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 text-center">
          <Sun className="mx-auto mb-2 h-5 w-5 text-yellow-500" />
          <p className="text-xs text-muted">Нетна печалба за 25 години</p>
          <p
            className={`text-2xl font-bold ${
              calculations.twentyFiveYearNet >= 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {calculations.twentyFiveYearNet >= 0 ? "+" : ""}
            {calculations.twentyFiveYearNet
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            <span className="text-sm font-normal text-muted">EUR</span>
          </p>
        </div>
      </div>

      {/* ---- Methodology Note ---- */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted space-y-1">
            <p>
              <strong className="text-text">Методология:</strong> Изчислението е базирано
              на средна слънчева радиация за България от{" "}
              {ANNUAL_PRODUCTION_PER_KW.toLocaleString("bg-BG")} kWh/kW/год.
              Приемаме модерни панели с мощност {PANEL_WATTS_PER_M2} W/m² и годишна
              деградация от {(DEGRADATION_RATE * 100).toFixed(1)}%.
            </p>
            <p>
              Цена на тока ({provider.name}):{" "}
              {(calculations.rateWithVat * 100).toFixed(2)} ст./kWh (с ДДС). Цена на
              системата: {PANEL_COST_PER_KW} EUR/kW. Инвертор: подмяна на година{" "}
              {INVERTER_REPLACEMENT_YEAR} ({(INVERTER_COST_RATIO * 100).toFixed(0)}% от
              цената).
            </p>
            <p>
              Нетно отчитане: излишъкът се изкупува на{" "}
              {(NET_METERING_RATE * 100).toFixed(0)}% от цената на дребно. Тарифи по
              данни на КЕВР (юли 2025 -- юни 2026). Животът на системата е{" "}
              {SYSTEM_LIFETIME} години.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
