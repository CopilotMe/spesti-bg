"use client";

import { useState, useEffect, useMemo, useId } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Globe,
  Info,
  Loader2,
  Calculator,
  ArrowRight,
  BarChart3,
  ShoppingBasket,
  Landmark,
  Receipt,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  fetchMinimumWages,
  fetchLabourCosts,
  fetchLabourCostIndex,
  type MinimumWageData,
  type LabourCostData,
  type LabourCostIndexData,
} from "@/lib/api";
import {
  calculateNetFromGross,
  calculateGrossFromNet,
  SALARY_CONSTANTS,
  type SalaryBreakdown,
} from "@/lib/salary";
import { formatCurrency } from "@/lib/utils";

const COUNTRY_COLORS: Record<string, string> = {
  BG: "#059669",
  RO: "#3b82f6",
  DE: "#f97316",
  EU27_2020: "#8b5cf6",
  EL: "#eab308",
  HR: "#ec4899",
};

function formatSemester(s: string): string {
  return s.replace(/^(\d{4})-S(\d)$/, (_, y, sn) =>
    sn === "1" ? `Яну ${y.slice(2)}` : `Юли ${y.slice(2)}`
  );
}

function formatQuarter(q: string): string {
  return q.replace(/^(\d{4})-Q(\d)$/, (_, y, qn) => `Q${qn} ${y.slice(2)}`);
}

export function SalaryDashboard() {
  const calcId = useId();
  const [mode, setMode] = useState<"gross" | "net">("gross");
  const [inputValue, setInputValue] = useState(1200);
  const [minWages, setMinWages] = useState<MinimumWageData | null>(null);
  const [labourCosts, setLabourCosts] = useState<LabourCostData | null>(null);
  const [lci, setLci] = useState<LabourCostIndexData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchMinimumWages(),
      fetchLabourCosts(),
      fetchLabourCostIndex(),
    ]).then(([mw, lc, li]) => {
      setMinWages(mw);
      setLabourCosts(lc);
      setLci(li);
      setLoading(false);
    });
  }, []);

  const breakdown: SalaryBreakdown = useMemo(() => {
    if (mode === "gross") {
      return calculateNetFromGross(inputValue);
    }
    return calculateGrossFromNet(inputValue);
  }, [mode, inputValue]);

  // Pie chart data for salary breakdown
  const pieData = useMemo(() => {
    return [
      { name: "Нето (чиста заплата)", value: parseFloat(breakdown.netEur.toFixed(2)), color: "#059669" },
      { name: "Пенсионен фонд (ДОО)", value: parseFloat(breakdown.employeeDooEur.toFixed(2)), color: "#3b82f6" },
      { name: "ДЗПО", value: parseFloat(breakdown.employeeDzpoEur.toFixed(2)), color: "#8b5cf6" },
      { name: "Здравно (ЗО)", value: parseFloat(breakdown.employeeZoEur.toFixed(2)), color: "#06b6d4" },
      { name: "Данък (ДОД 10%)", value: parseFloat(breakdown.incomeTaxEur.toFixed(2)), color: "#f97316" },
    ];
  }, [breakdown]);

  // Minimum wage latest values per country
  const mwLatest = useMemo(() => {
    if (!minWages) return [];
    return minWages.countries
      .map((c) => {
        const latest = c.periods[c.periods.length - 1];
        return latest ? { ...c, latestValue: latest.value, latestPeriod: latest.period } : null;
      })
      .filter(Boolean) as (MinimumWageData["countries"][0] & { latestValue: number; latestPeriod: string })[];
  }, [minWages]);

  // Minimum wage line chart data
  const mwLineData = useMemo(() => {
    if (!minWages) return [];
    const allPeriods = new Set<string>();
    for (const c of minWages.countries) {
      for (const p of c.periods) allPeriods.add(p.period);
    }
    return Array.from(allPeriods)
      .sort()
      .map((period) => {
        const point: Record<string, string | number | null> = {
          period: formatSemester(period),
        };
        for (const c of minWages.countries) {
          const p = c.periods.find((x) => x.period === period);
          point[c.label] = p ? p.value : null;
        }
        return point;
      });
  }, [minWages]);

  // LCI chart data
  const lciChartData = useMemo(() => {
    if (!lci) return [];
    return lci.quarters.map((q) => ({
      period: formatQuarter(q.period),
      "Индекс (2020=100)": parseFloat(q.value.toFixed(1)),
    }));
  }, [lci]);

  return (
    <div className="space-y-6">
      {/* НЕТО/БРУТО КАЛКУЛАТОР */}
      <div className="rounded-2xl border-2 border-primary bg-primary/5 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-text">
            Калкулатор нето / бруто заплата (2026)
          </h2>
        </div>

        {/* Mode toggle */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode("gross")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "gross"
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:text-text"
            }`}
          >
            Бруто → Нето
          </button>
          <button
            onClick={() => setMode("net")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "net"
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:text-text"
            }`}
          >
            Нето → Бруто
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label htmlFor={`${calcId}-salary`} className="mb-1 block text-sm font-medium text-text">
            {mode === "gross" ? "Брутна заплата" : "Нетна заплата (на ръка)"} (EUR)
          </label>
          <input
            id={`${calcId}-salary`}
            type="number"
            min={0}
            max={50000}
            step={50}
            value={inputValue}
            onChange={(e) => setInputValue(Math.max(0, Number(e.target.value)))}
            className="w-full max-w-xs rounded-lg border border-border bg-surface px-4 py-2 text-lg font-bold text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {/* Quick presets */}
          <div className="mt-2 flex flex-wrap gap-2">
            {[620, 900, 1200, 1500, 2000, 3000].map((v) => (
              <button
                key={v}
                onClick={() => setInputValue(v)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  inputValue === v
                    ? "bg-primary text-white"
                    : "bg-surface text-muted hover:bg-gray-100"
                }`}
              >
                {v} €
                {v === 620 && " (МРЗ)"}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-xs text-muted">Бруто заплата</p>
            <p className="text-2xl font-bold text-text">
              {formatCurrency(breakdown.grossEur)}
            </p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
            <p className="text-xs text-muted">Нето (на ръка)</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(breakdown.netEur)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-xs text-muted">Осигуровки (работник)</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(breakdown.totalEmployeeInsuranceEur)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-xs text-muted">ДОД (10%)</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(breakdown.incomeTaxEur)}
            </p>
          </div>
        </div>

        {/* Detailed breakdown + pie */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-muted">Бруто заплата</td>
                  <td className="px-4 py-2 text-right font-semibold text-text">
                    {formatCurrency(breakdown.grossEur)}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-muted">
                    − Пенсионен фонд (ДОО {SALARY_CONSTANTS.rates.employeeDoo}%)
                  </td>
                  <td className="px-4 py-2 text-right text-blue-600">
                    −{formatCurrency(breakdown.employeeDooEur)}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-muted">
                    − ДЗПО ({SALARY_CONSTANTS.rates.employeeDzpo}%)
                  </td>
                  <td className="px-4 py-2 text-right text-blue-600">
                    −{formatCurrency(breakdown.employeeDzpoEur)}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-muted">
                    − Здравно ({SALARY_CONSTANTS.rates.employeeZo}%)
                  </td>
                  <td className="px-4 py-2 text-right text-blue-600">
                    −{formatCurrency(breakdown.employeeZoEur)}
                  </td>
                </tr>
                <tr className="border-b border-border bg-gray-50">
                  <td className="px-4 py-2 font-medium text-text">
                    = Облагаем доход
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-text">
                    {formatCurrency(breakdown.taxableIncomeEur)}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-muted">− ДОД (10%)</td>
                  <td className="px-4 py-2 text-right text-orange-600">
                    −{formatCurrency(breakdown.incomeTaxEur)}
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-4 py-2 font-bold text-green-700">
                    = Нетна заплата
                  </td>
                  <td className="px-4 py-2 text-right text-lg font-bold text-green-600">
                    {formatCurrency(breakdown.netEur)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-t border-border px-4 py-2 text-xs text-muted">
              Ефективна данъчна ставка:{" "}
              <strong>{(breakdown.effectiveTaxRate * 100).toFixed(1)}%</strong>
              {" "}| Нето/Бруто:{" "}
              <strong>{(breakdown.netToGrossRatio * 100).toFixed(1)}%</strong>
              {breakdown.grossEur > SALARY_CONSTANTS.maxInsuranceIncomeEur && (
                <> | Над макс. осиг. доход ({formatCurrency(SALARY_CONSTANTS.maxInsuranceIncomeEur)})</>
              )}
            </div>
          </div>

          {/* Pie chart */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-2 text-center text-sm font-medium text-text">
              Разпределение на брутната заплата
            </p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(2)} €`, ""]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11 }}
                    formatter={(value) => <span className="text-text">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Employer cost */}
        <div className="mt-4 rounded-lg border border-border bg-surface px-4 py-3">
          <p className="text-sm text-muted">
            <strong className="text-text">Цена за работодателя:</strong>{" "}
            {formatCurrency(breakdown.totalCostEur)} (бруто + {formatCurrency(breakdown.employerInsuranceEur)} осигуровки от работодател)
          </p>
        </div>
      </div>

      {/* Eurostat data loading */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted" />
          <span className="text-muted">Зареждане на данни от Eurostat...</span>
        </div>
      ) : (
        <>
          {/* Data source */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <Info className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-text">
              <strong>Източници:</strong>{" "}
              <a
                href="https://ec.europa.eu/eurostat/databrowser/product/view/earn_mw_cur"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Eurostat earn_mw_cur
              </a>
              {" "}(минимални заплати),{" "}
              <a
                href="https://ec.europa.eu/eurostat/databrowser/product/view/lc_lci_lev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                lc_lci_lev
              </a>
              {" "}(разходи за труд),{" "}
              <a
                href="https://ec.europa.eu/eurostat/databrowser/product/view/lc_lci_r2_q"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                lc_lci_r2_q
              </a>
              {" "}(индекс) | Обновяване: <strong>автоматично</strong>
            </p>
          </div>

          {/* MINIMUM WAGES — latest bar */}
          {mwLatest.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-text">
                  Минимална заплата — България vs съседи
                  {mwLatest[0] && (
                    <span className="ml-2 font-normal text-muted">
                      ({formatSemester(mwLatest[0].latestPeriod)})
                    </span>
                  )}
                </h3>
              </div>

              {/* Summary cards */}
              <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {[...mwLatest]
                  .sort((a, b) => a.latestValue - b.latestValue)
                  .map((c) => (
                    <div
                      key={c.geo}
                      className={`rounded-lg border p-3 text-center ${
                        c.geo === "BG"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background"
                      }`}
                    >
                      <p className="text-xs text-muted">{c.label}</p>
                      <p
                        className={`text-xl font-bold ${
                          c.geo === "BG" ? "text-primary" : "text-text"
                        }`}
                      >
                        {c.latestValue.toFixed(0)} €
                      </p>
                    </div>
                  ))}
              </div>

              {/* Line chart — MW over time */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mwLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: number) => `${v} €`}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        `${Number(value).toFixed(0)} €`,
                        name,
                      ]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    {minWages?.countries.map((c) => (
                      <Line
                        key={c.geo}
                        type="monotone"
                        dataKey={c.label}
                        stroke={COUNTRY_COLORS[c.geo] || "#9ca3af"}
                        strokeWidth={c.geo === "BG" ? 2.5 : 1.5}
                        dot={c.geo === "BG"}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted">
                Брутна минимална заплата в EUR, полугодишни данни.
                Източник: Eurostat earn_mw_cur.
              </p>
            </div>
          )}

          {/* LABOUR COSTS per hour */}
          {labourCosts && labourCosts.totalPerHour.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-text">
                  Часова цена на труда — сравнение с ЕС
                  {labourCosts.totalPerHour[0] && (
                    <span className="ml-2 font-normal text-muted">
                      ({labourCosts.totalPerHour[0].period})
                    </span>
                  )}
                </h3>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={labourCosts.totalPerHour.map((e) => ({
                      name: e.label,
                      geo: e.geo,
                      value: parseFloat(e.value.toFixed(1)),
                    }))}
                    layout="vertical"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: number) => `${v} €/ч`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toFixed(1)} €/час`,
                        "Обща цена на труда",
                      ]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {labourCosts.totalPerHour.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={COUNTRY_COLORS[entry.geo] || "#9ca3af"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted">
                Обща часова цена на труда в EUR (заплата + осигуровки от
                работодател), сектори B-S. Източник: Eurostat lc_lci_lev.
              </p>
            </div>
          )}

          {/* LABOUR COST INDEX — BG growth */}
          {lciChartData.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-text">
                  Ръст на заплатите в България (индекс 2020=100)
                </h3>
              </div>

              {/* Summary */}
              {lci && lci.quarters.length >= 2 && (() => {
                const latest = lci.quarters[lci.quarters.length - 1];
                const first = lci.quarters[0];
                const growth = latest.value - 100;
                return (
                  <div className="mb-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-background p-3 text-center">
                      <p className="text-xs text-muted">Текущ индекс</p>
                      <p className="text-xl font-bold text-primary">
                        {latest.value.toFixed(1)}
                      </p>
                      <p className="text-[10px] text-muted">
                        {formatQuarter(latest.period)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                      <p className="text-xs text-muted">Ръст от 2020</p>
                      <p className="text-xl font-bold text-green-600">
                        +{growth.toFixed(0)}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-3 text-center">
                      <p className="text-xs text-muted">Начална точка</p>
                      <p className="text-xl font-bold text-text">100.0</p>
                      <p className="text-[10px] text-muted">2020</p>
                    </div>
                  </div>
                );
              })()}

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lciChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      domain={[80, "auto"]}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toFixed(1)}`,
                        "Индекс",
                      ]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="Индекс (2020=100)"
                      radius={[4, 4, 0, 0]}
                      fill="#059669"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted">
                Индекс на разходите за заплати (D11), 2020=100, несезонно
                изгладен, сектори B-S. Източник: Eurostat lc_lci_r2_q.
              </p>
            </div>
          )}
        </>
      )}

      {/* FUNNEL — What does your salary cover? */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 font-semibold text-text">
          Какво покрива заплатата ти?
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/budget"
            className="group rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <Receipt className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-text group-hover:text-primary">
              Семеен бюджет
            </p>
            <p className="text-xs text-muted">
              Планирай месечните разходи
            </p>
            <ArrowRight className="mt-2 h-4 w-4 text-muted group-hover:text-primary" />
          </Link>
          <Link
            href="/koshnitsa"
            className="group rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <ShoppingBasket className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-text group-hover:text-primary">
              Потребителска кошница
            </p>
            <p className="text-xs text-muted">
              21 продукта — колко кошници от заплатата?
            </p>
            <ArrowRight className="mt-2 h-4 w-4 text-muted group-hover:text-primary" />
          </Link>
          <Link
            href="/krediti"
            className="group rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <Landmark className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-text group-hover:text-primary">
              Кредити
            </p>
            <p className="text-xs text-muted">
              Сравни лихви и месечни вноски
            </p>
            <ArrowRight className="mt-2 h-4 w-4 text-muted group-hover:text-primary" />
          </Link>
          <Link
            href="/inflacia"
            className="group rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <TrendingUp className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-text group-hover:text-primary">
              Инфлация
            </p>
            <p className="text-xs text-muted">
              Заплатата расте ли по-бързо от цените?
            </p>
            <ArrowRight className="mt-2 h-4 w-4 text-muted group-hover:text-primary" />
          </Link>
        </div>
      </div>

      {/* What this means */}
      <div className="rounded-xl border border-border bg-primary/5 p-5">
        <p className="text-xs text-muted leading-relaxed">
          <strong className="text-text">Как да чета данните?</strong>{" "}
          Минималната заплата е брутната сума, определена от правителството.
          Нетната заплата (на ръка) е с ~20% по-ниска заради осигуровки и
          данък. Часовата цена на труда включва и осигуровките от работодателя
          — тя показва колко реално струва един служител. Индексът на заплатите
          (2020=100) показва с колко процента са нараснали заплатите спрямо
          2020 г.
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted">
        Калкулаторът е за трета категория труд, трудов договор, 2026 г.
        Осигурителните ставки може да се различават за свободни професии,
        самоосигуряващи се и морско право. Данните от Eurostat се обновяват
        автоматично (revalidate: 24 часа).
      </p>
    </div>
  );
}
