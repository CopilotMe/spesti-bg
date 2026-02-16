"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ShoppingBasket,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  BarChart3,
  Loader2,
  Wallet,
  CalendarClock,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  basketProducts,
  currentBasketTotal,
  basketHistory,
  latestCompleteTotal,
  isCurrentMonthComplete,
  minimumWageEur,
  categoryLabels,
  basketLastUpdated,
  basketDataSource,
  basketUpdateFrequency,
} from "@/data/basket";
import { fetchFoodHicp, type FoodHicpData } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { BasketProduct } from "@/lib/types";

type SortKey = "name" | "price" | "change";

const CATEGORY_COLORS: Record<BasketProduct["category"], string> = {
  bread: "#eab308",
  dairy: "#3b82f6",
  meat: "#ef4444",
  oil: "#f97316",
  vegetables: "#22c55e",
  fruits: "#a855f7",
  other: "#6b7280",
};

export function BasketDashboard() {
  const [sortKey, setSortKey] = useState<SortKey>("change");
  const [sortDesc, setSortDesc] = useState(true);
  const [foodHicp, setFoodHicp] = useState<FoodHicpData | null>(null);
  const [hicpLoading, setHicpLoading] = useState(true);

  useEffect(() => {
    fetchFoodHicp().then((d) => {
      setFoodHicp(d);
      setHicpLoading(false);
    });
  }, []);

  const sortedProducts = useMemo(() => {
    const arr = [...basketProducts];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name, "bg");
      } else if (sortKey === "price") {
        cmp = a.priceEur - b.priceEur;
      } else {
        const changeA = a.previousPriceEur ? a.priceEur - a.previousPriceEur : 0;
        const changeB = b.previousPriceEur ? b.priceEur - b.previousPriceEur : 0;
        cmp = changeA - changeB;
      }
      return sortDesc ? -cmp : cmp;
    });
    return arr;
  }, [sortKey, sortDesc]);

  // Category breakdown for chart
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of basketProducts) {
      const label = categoryLabels[p.category];
      map.set(label, (map.get(label) || 0) + p.priceEur);
    }
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total: parseFloat(total.toFixed(2)) }))
      .sort((a, b) => b.total - a.total);
  }, []);

  // History chart data
  const historyChartData = basketHistory.map((h) => {
    const label = h.month.replace(/^(\d{4})-(\d{2})$/, (_, y, m) => {
      const months = ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"];
      return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
    });
    return { period: label, total: parseFloat(h.totalEur.toFixed(2)) };
  });

  // Използваме последния пълен месец за изчисления
  const displayTotal = isCurrentMonthComplete ? currentBasketTotal : latestCompleteTotal;

  // Month-over-month change (последен пълен vs предпоследен)
  const prevMonthTotal = basketHistory.length >= 2
    ? basketHistory[basketHistory.length - 2].totalEur
    : null;
  const monthChange = prevMonthTotal
    ? displayTotal - prevMonthTotal
    : 0;
  const monthChangePct = prevMonthTotal
    ? ((monthChange / prevMonthTotal) * 100)
    : 0;

  // How many baskets can min wage buy
  const basketsPerWage = minimumWageEur / displayTotal;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(key === "change");
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total basket */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <ShoppingBasket className="mx-auto mb-2 h-8 w-8 text-primary" />
          <p className="text-sm text-muted">Обща стойност на кошницата</p>
          <p className="text-3xl font-bold text-text">{formatCurrency(displayTotal)}</p>
          <p className="text-xs text-muted">
            {basketProducts.length} продукта
            {!isCurrentMonthComplete && " (яну 2026)"}
          </p>
        </div>

        {/* Monthly change */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          {monthChange > 0 ? (
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-red-500" />
          ) : (
            <TrendingDown className="mx-auto mb-2 h-8 w-8 text-green-500" />
          )}
          <p className="text-sm text-muted">Промяна за месец</p>
          <p className={`text-3xl font-bold ${monthChange > 0 ? "text-red-600" : "text-green-600"}`}>
            {monthChange > 0 ? "+" : ""}{formatCurrency(monthChange)}
          </p>
          <p className={`text-xs ${monthChange > 0 ? "text-red-500" : "text-green-500"}`}>
            {monthChange > 0 ? "+" : ""}{monthChangePct.toFixed(1)}% спрямо предходния месец
          </p>
        </div>

        {/* Min wage comparison */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <Wallet className="mx-auto mb-2 h-8 w-8 text-primary" />
          <p className="text-sm text-muted">Кошници от минимална заплата</p>
          <p className="text-3xl font-bold text-primary">{basketsPerWage.toFixed(1)}x</p>
          <p className="text-xs text-muted">при МРЗ от {formatCurrency(minimumWageEur)}</p>
        </div>

        {/* Since June 2025 */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <CalendarClock className="mx-auto mb-2 h-8 w-8 text-primary" />
          <p className="text-sm text-muted">Промяна от юни 2025</p>
          {(() => {
            const june = basketHistory[0]?.totalEur || displayTotal;
            const diff = displayTotal - june;
            const pct = ((diff / june) * 100);
            const months = basketHistory.length - 1;
            return (
              <>
                <p className={`text-3xl font-bold ${diff > 0 ? "text-red-600" : "text-green-600"}`}>
                  {diff > 0 ? "+" : ""}{pct.toFixed(1)}%
                </p>
                <p className="text-xs text-muted">
                  {diff > 0 ? "+" : ""}{formatCurrency(diff)} за {months} месеца
                </p>
              </>
            );
          })()}
        </div>
      </div>

      {/* Data source label */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Info className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-text">
          <strong>Източник:</strong>{" "}
          <a
            href="https://knsb-bg.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {basketDataSource}
          </a>
          {" "}(Конфедерация на независимите синдикати в България)
          {" "}| Обновяване: <strong>{basketUpdateFrequency}</strong>
          {" "}| Последна актуализация: <strong>{basketLastUpdated}</strong>
          {" "}| Наблюдение в 600+ магазина, 81 общини
        </p>
      </div>

      {/* History chart */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text">Стойност на кошницата по месеци</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => `${v} €`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(2)} €`, "Стойност"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#059669" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-muted">
          Стойности до декември 2025 конвертирани от BGN (1 EUR = 1.95583 BGN).
          {!isCurrentMonthComplete && (
            <> Февруари 2026 е изключен от графиката — данните от КНСБ все още са непълни.</>
          )}
        </p>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 font-semibold text-text">Разбивка по категории</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickFormatter={(v: number) => `${v} €`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={120}
              />
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(2)} €`, "Стойност"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry, i) => {
                  const catKey = Object.entries(categoryLabels).find(
                    ([, v]) => v === entry.name
                  )?.[0] as BasketProduct["category"] | undefined;
                  return (
                    <Cell
                      key={i}
                      fill={catKey ? CATEGORY_COLORS[catKey] : "#9ca3af"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product table */}
      <div className="rounded-2xl border border-border bg-surface">
        <div className="border-b border-border p-4">
          <h3 className="font-semibold text-text">Всички продукти в кошницата</h3>
          <p className="text-sm text-muted">Натиснете заглавие за сортиране</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th
                  onClick={() => handleSort("name")}
                  className="cursor-pointer px-4 py-3 text-left font-medium text-muted hover:text-text"
                >
                  Продукт {sortKey === "name" ? (sortDesc ? "↓" : "↑") : ""}
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">Категория</th>
                <th className="px-4 py-3 text-center font-medium text-muted">Мерна единица</th>
                <th
                  onClick={() => handleSort("price")}
                  className="cursor-pointer px-4 py-3 text-right font-medium text-muted hover:text-text"
                >
                  Цена {sortKey === "price" ? (sortDesc ? "↓" : "↑") : ""}
                </th>
                <th
                  onClick={() => handleSort("change")}
                  className="cursor-pointer px-4 py-3 text-right font-medium text-muted hover:text-text"
                >
                  Промяна {sortKey === "change" ? (sortDesc ? "↓" : "↑") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((p) => {
                const change = p.previousPriceEur ? p.priceEur - p.previousPriceEur : 0;
                const changePct = p.previousPriceEur
                  ? ((change / p.previousPriceEur) * 100)
                  : 0;
                return (
                  <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-text">{p.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: CATEGORY_COLORS[p.category] }}
                      >
                        {categoryLabels[p.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-muted">{p.unit}</td>
                    <td className="px-4 py-3 text-right font-bold text-text">
                      {formatCurrency(p.priceEur)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {change === 0 ? (
                        <span className="inline-flex items-center gap-1 text-gray-400">
                          <Minus className="h-3 w-3" /> 0%
                        </span>
                      ) : change > 0 ? (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <ArrowUpRight className="h-3 w-3" />
                          +{changePct.toFixed(1)}%
                          <span className="text-xs text-muted">(+{formatCurrency(change)})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <ArrowDownRight className="h-3 w-3" />
                          {changePct.toFixed(1)}%
                          <span className="text-xs text-muted">({formatCurrency(change)})</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-gray-50 font-bold">
                <td className="px-4 py-3 text-text" colSpan={3}>
                  Общо
                  {!isCurrentMonthComplete && (
                    <span className="ml-2 text-xs font-normal text-amber-600">
                      (февруарските цени са предварителни)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-text text-lg">
                  {formatCurrency(currentBasketTotal)}
                </td>
                <td className="px-4 py-3 text-right">
                  {monthChange > 0 ? (
                    <span className="text-red-600">+{formatCurrency(monthChange)}</span>
                  ) : (
                    <span className="text-green-600">{formatCurrency(monthChange)}</span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Eurostat food inflation widget */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text">Инфлация на храните (Eurostat HICP)</h3>
        </div>
        {hicpLoading ? (
          <div className="flex items-center gap-2 py-8 justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted" />
            <span className="text-sm text-muted">Зареждане от Eurostat...</span>
          </div>
        ) : foodHicp ? (
          <>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Храни", data: foodHicp.food },
                { label: "Безалкохолни", data: foodHicp.nonAlcoholic },
                { label: "Обща инфлация", data: foodHicp.overall },
              ].map(({ label, data }) => {
                const latest = data[data.length - 1];
                if (!latest) return null;
                const isUp = latest.value > 0;
                return (
                  <div key={label} className="rounded-lg border border-border bg-background p-3 text-center">
                    <p className="text-xs text-muted">{label}</p>
                    <div className={`flex items-center justify-center gap-1 ${isUp ? "text-red-600" : "text-green-600"}`}>
                      {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      <span className="text-lg font-bold">
                        {latest.value > 0 ? "+" : ""}{latest.value.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-[10px] text-muted">{latest.period}</p>
                  </div>
                );
              })}
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={(() => {
                    const allPeriods = new Set<string>();
                    for (const dp of [...foodHicp.food, ...foodHicp.nonAlcoholic, ...foodHicp.overall]) {
                      allPeriods.add(dp.period);
                    }
                    return Array.from(allPeriods).sort().map((period) => {
                      const label = period.replace(/^(\d{4})-(\d{2})$/, (_, y, m) => {
                        const months = ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"];
                        return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
                      });
                      return {
                        period: label,
                        food: foodHicp.food.find((d) => d.period === period)?.value ?? null,
                        nonAlcoholic: foodHicp.nonAlcoholic.find((d) => d.period === period)?.value ?? null,
                        overall: foodHicp.overall.find((d) => d.period === period)?.value ?? null,
                      };
                    });
                  })()}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, ""]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="food" name="Храни" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="nonAlcoholic" name="Безалкохолни" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                  <Line
                    type="monotone"
                    dataKey="overall"
                    name="Обща инфлация"
                    stroke="#6b7280"
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="6 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted">
              Годишна промяна (%) спрямо същия месец на предходната година. Източник: Eurostat HICP.
              Обновява се автоматично всеки ден.
            </p>
          </>
        ) : (
          <p className="text-sm text-muted">Данните от Eurostat не са налични в момента.</p>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted">
        Цените са средни за страната, наблюдавани от КНСБ в 600+ магазина. Могат да варират по региони.
        Данните за инфлацията са от Eurostat HICP и се обновяват автоматично (revalidate: 24 часа).
      </p>
    </div>
  );
}
