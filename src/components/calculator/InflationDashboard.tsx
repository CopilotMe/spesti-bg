"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Info,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ShoppingBasket,
  Home,
  Car,
  Heart,
  Phone,
  GraduationCap,
  UtensilsCrossed,
  Gamepad2,
  Shirt,
  Sofa,
  Wine,
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
} from "recharts";
import {
  fetchInflationDashboard,
  type InflationDashboardData,
  type InflationCategory,
} from "@/lib/api";
import { PdfExportButton } from "@/components/ui/PdfExportButton";

const ICON_MAP: Record<string, typeof TrendingUp> = {
  TrendingUp,
  ShoppingBasket,
  Wine,
  Shirt,
  Home,
  Sofa,
  Heart,
  Car,
  Phone,
  Gamepad2,
  GraduationCap,
  UtensilsCrossed,
};

function formatPeriod(p: string): string {
  return p.replace(/^(\d{4})-(\d{2})$/, (_, y, m) => {
    const months = [
      "Яну", "Фев", "Мар", "Апр", "Май", "Юни",
      "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек",
    ];
    return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
  });
}

export function InflationDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<InflationDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(["overall", "food", "housing", "transport"])
  );

  useEffect(() => {
    fetchInflationDashboard().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  // Latest values for each category
  const latestValues = useMemo(() => {
    if (!data) return [];
    return data.categories
      .map((cat) => {
        const latest = cat.data[cat.data.length - 1];
        const prev = cat.data.length >= 2 ? cat.data[cat.data.length - 2] : null;
        return {
          ...cat,
          latestValue: latest?.value ?? null,
          latestPeriod: latest?.period ?? "",
          prevValue: prev?.value ?? null,
          trend: latest && prev ? latest.value - prev.value : 0,
        };
      })
      .filter((c) => c.latestValue !== null);
  }, [data]);

  // Overall inflation data
  const overall = latestValues.find((c) => c.key === "overall");

  // Categories sorted by latest value (excluding overall)
  const categoriesSorted = useMemo(() => {
    return latestValues
      .filter((c) => c.key !== "overall")
      .sort((a, b) => (b.latestValue ?? 0) - (a.latestValue ?? 0));
  }, [latestValues]);

  // BG vs EU chart data
  const bgVsEuChart = useMemo(() => {
    if (!data) return [];
    return data.bgVsEu.map((d) => ({
      period: formatPeriod(d.period),
      "\u0411\u044A\u043B\u0433\u0430\u0440\u0438\u044F": d.bg,
      "\u0415\u0421 \u0441\u0440\u0435\u0434\u043D\u043E": d.eu,
    }));
  }, [data]);

  // Multi-line chart for selected categories
  const selectedChartData = useMemo(() => {
    if (!data) return [];
    const selected = data.categories.filter((c) => selectedCategories.has(c.key));
    const allPeriods = new Set<string>();
    for (const cat of selected) {
      for (const d of cat.data) allPeriods.add(d.period);
    }
    return Array.from(allPeriods)
      .sort()
      .map((period) => {
        const point: Record<string, string | number | null> = {
          period: formatPeriod(period),
        };
        for (const cat of selected) {
          point[cat.label] =
            cat.data.find((d) => d.period === period)?.value ?? null;
        }
        return point;
      });
  }, [data, selectedCategories]);

  // Bar chart — latest month by category
  const barData = useMemo(() => {
    return categoriesSorted.map((c) => ({
      name: c.label,
      value: c.latestValue ?? 0,
      color: c.color,
    }));
  }, [categoriesSorted]);

  function toggleCategory(key: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted" />
        <span className="text-muted">Зареждане на данни от Eurostat...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="py-8 text-center text-muted">
        Данните от Eurostat не са налични в момента. Опитайте по-късно.
      </p>
    );
  }

  return (
    <div ref={dashboardRef} className="space-y-6">
      <div className="flex justify-end">
        <PdfExportButton
          contentRef={dashboardRef}
          filename="spesti-inflacia"
          title="Инфлация в България"
        />
      </div>

      {/* Hero cards */}
      <div data-pdf-section="hero" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall inflation */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          {overall && overall.latestValue !== null && overall.latestValue > 0 ? (
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-red-500" />
          ) : (
            <TrendingDown className="mx-auto mb-2 h-8 w-8 text-green-500" />
          )}
          <p className="text-sm text-muted">Обща инфлация (г/г)</p>
          <p
            className={`text-3xl font-bold ${
              overall && overall.latestValue !== null && overall.latestValue > 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {overall?.latestValue !== null && overall?.latestValue !== undefined
              ? `${overall.latestValue > 0 ? "+" : ""}${overall.latestValue.toFixed(1)}%`
              : "\u2014"}
          </p>
          <p className="text-xs text-muted">
            {overall?.latestPeriod ? formatPeriod(overall.latestPeriod) : ""}
          </p>
        </div>

        {/* Highest category */}
        {categoriesSorted[0] && (
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 text-center">
            <ArrowUpRight className="mx-auto mb-2 h-8 w-8 text-red-500" />
            <p className="text-sm text-muted">Най-висока инфлация</p>
            <p className="text-2xl font-bold text-red-600">
              {categoriesSorted[0].latestValue !== null
                ? `${categoriesSorted[0].latestValue > 0 ? "+" : ""}${categoriesSorted[0].latestValue.toFixed(1)}%`
                : "\u2014"}
            </p>
            <p className="text-xs font-medium text-red-500">
              {categoriesSorted[0].label}
            </p>
          </div>
        )}

        {/* Lowest category */}
        {categoriesSorted[categoriesSorted.length - 1] && (
          <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5 text-center">
            <ArrowDownRight className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <p className="text-sm text-muted">Най-ниска инфлация</p>
            <p className="text-2xl font-bold text-green-600">
              {categoriesSorted[categoriesSorted.length - 1].latestValue !== null
                ? `${categoriesSorted[categoriesSorted.length - 1].latestValue! > 0 ? "+" : ""}${categoriesSorted[categoriesSorted.length - 1].latestValue!.toFixed(1)}%`
                : "\u2014"}
            </p>
            <p className="text-xs font-medium text-green-500">
              {categoriesSorted[categoriesSorted.length - 1].label}
            </p>
          </div>
        )}

        {/* Trend */}
        {overall && overall.prevValue !== null && overall.latestValue !== null && (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-sm text-muted">Тенденция</p>
            {overall.trend < 0 ? (
              <>
                <TrendingDown className="mx-auto mb-1 h-6 w-6 text-green-500" />
                <p className="text-lg font-bold text-green-600">Забавяне</p>
              </>
            ) : overall.trend > 0 ? (
              <>
                <TrendingUp className="mx-auto mb-1 h-6 w-6 text-red-500" />
                <p className="text-lg font-bold text-red-600">Ускоряване</p>
              </>
            ) : (
              <>
                <Minus className="mx-auto mb-1 h-6 w-6 text-gray-400" />
                <p className="text-lg font-bold text-gray-500">Стабилно</p>
              </>
            )}
            <p className="text-xs text-muted">
              {overall.trend > 0 ? "+" : ""}
              {overall.trend.toFixed(1)} пр.п. спрямо предходен месец
            </p>
          </div>
        )}
      </div>

      {/* Data source */}
      <div data-pdf-section="data-source" className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Info className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-text">
          <strong>Източник:</strong>{" "}
          <a
            href="https://ec.europa.eu/eurostat/databrowser/product/view/prc_hicp_manr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Eurostat HICP
          </a>{" "}
          (prc_hicp_manr) | Обновяване:{" "}
          <strong>автоматично, всеки ден</strong> | Годишна промяна на
          хармонизирания индекс на потребителските цени
        </p>
      </div>

      {/* Bar chart — all categories latest month */}
      <div data-pdf-section="bar-chart" className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text">
            Инфлация по категории{" "}
            {overall?.latestPeriod && (
              <span className="font-normal text-muted">
                ({formatPeriod(overall.latestPeriod)}, г/г %)
              </span>
            )}
          </h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={150}
              />
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(1)}%`, "Инфлация"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {barData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.value >= 0 ? entry.color : "#22c55e"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Reference line note */}
        {overall?.latestValue !== null && overall?.latestValue !== undefined && (
          <p className="mt-2 text-xs text-muted">
            Обща инфлация:{" "}
            <strong>
              {overall.latestValue > 0 ? "+" : ""}
              {overall.latestValue.toFixed(1)}%
            </strong>
            . Категориите над тази стойност поскъпват по-бързо от средното.
          </p>
        )}
      </div>

      {/* Category cards grid */}
      <div data-pdf-section="categories" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categoriesSorted.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || TrendingUp;
          const isUp = (cat.latestValue ?? 0) > 0;
          return (
            <button
              key={cat.key}
              onClick={() => toggleCategory(cat.key)}
              className={`rounded-xl border p-4 text-left transition-all ${
                selectedCategories.has(cat.key)
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-surface hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color: cat.color }} />
                  <span className="text-sm font-medium text-text">
                    {cat.label}
                  </span>
                </div>
                <span
                  className={`text-lg font-bold ${
                    isUp ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {cat.latestValue !== null
                    ? `${isUp ? "+" : ""}${cat.latestValue.toFixed(1)}%`
                    : "\u2014"}
                </span>
              </div>
              {cat.trend !== 0 && (
                <p
                  className={`mt-1 text-[10px] ${
                    cat.trend > 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {cat.trend > 0 ? "\u2191" : "\u2193"}{" "}
                  {Math.abs(cat.trend).toFixed(1)} пр.п. спрямо предходен месец
                </p>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted text-center">
        Натиснете категория за да я добавите/премахнете от графиката по-долу.
      </p>

      {/* Multi-line chart — selected categories */}
      <div data-pdf-section="line-chart" className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text">
            Динамика на инфлацията по категории (г/г, %)
          </h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selectedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}%`,
                  name,
                ]}
                contentStyle={{ fontSize: 12 }}
                itemStyle={{ padding: "2px 0" }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              {data.categories
                .filter((c) => selectedCategories.has(c.key))
                .map((cat) => (
                  <Line
                    key={cat.key}
                    type="monotone"
                    dataKey={cat.label}
                    stroke={cat.color}
                    strokeWidth={cat.key === "overall" ? 2.5 : 1.5}
                    dot={cat.key === "overall"}
                    strokeDasharray={
                      cat.key === "overall" ? "6 3" : undefined
                    }
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BG vs EU comparison */}
      <div data-pdf-section="bg-vs-eu" className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text">
            България vs ЕС средно — обща инфлация
          </h3>
        </div>

        {/* Summary: latest BG vs EU */}
        {data.bgVsEu.length > 0 && (() => {
          const latest = data.bgVsEu[data.bgVsEu.length - 1];
          const diff =
            latest.bg !== null && latest.eu !== null
              ? latest.bg - latest.eu
              : null;
          return (
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-3 text-center">
                <p className="text-xs text-muted">България</p>
                <p
                  className={`text-xl font-bold ${
                    latest.bg !== null && latest.bg > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {latest.bg !== null
                    ? `${latest.bg > 0 ? "+" : ""}${latest.bg.toFixed(1)}%`
                    : "\u2014"}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3 text-center">
                <p className="text-xs text-muted">ЕС средно</p>
                <p
                  className={`text-xl font-bold ${
                    latest.eu !== null && latest.eu > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {latest.eu !== null
                    ? `${latest.eu > 0 ? "+" : ""}${latest.eu.toFixed(1)}%`
                    : "\u2014"}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3 text-center">
                <p className="text-xs text-muted">Разлика</p>
                <p
                  className={`text-xl font-bold ${
                    diff !== null && diff > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {diff !== null
                    ? `${diff > 0 ? "+" : ""}${diff.toFixed(1)} пр.п.`
                    : "\u2014"}
                </p>
                <p className="text-[10px] text-muted">
                  {diff !== null && diff > 0
                    ? "По-висока от ЕС"
                    : "По-ниска от ЕС"}
                </p>
              </div>
            </div>
          );
        })()}

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bgVsEuChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}%`,
                  name,
                ]}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line
                type="monotone"
                dataKey={"\u0411\u044A\u043B\u0433\u0430\u0440\u0438\u044F"}
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey={"\u0415\u0421 \u0441\u0440\u0435\u0434\u043D\u043E"}
                stroke="#8b5cf6"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="6 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* What does this mean */}
      <div data-pdf-section="explainer" className="rounded-xl border border-border bg-primary/5 p-5">
        <p className="text-xs text-muted leading-relaxed">
          <strong className="text-text">Какво означава инфлацията за мен?</strong>{" "}
          Инфлацията показва колко са поскъпнали стоките и услугите спрямо
          същия месец миналата година. Ако храните растат с +5%, а заплатата
          ви е нараснала с +3%, реалната ви покупателна способност е намаляла.
          Категориите с по-висока инфлация от общата удрят по-силно бюджета на
          домакинствата.
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted">
        Данните се обновяват автоматично от Eurostat (revalidate: 24 часа).
        HICP = Хармонизиран индекс на потребителските цени. Стойностите
        показват годишна промяна (%) спрямо същия месец на предходната година.
      </p>
    </div>
  );
}
