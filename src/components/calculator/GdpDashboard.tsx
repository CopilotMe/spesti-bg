"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Info,
  Loader2,
  SearchCheck,
  ShoppingCart,
  Factory,
  Plane,
  Package,
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
  fetchGdpGrowth,
  fetchGdpComparison,
  fetchGdpExpenditure,
  type GdpGrowthData,
  type GdpComparisonData,
  type GdpExpenditureData,
} from "@/lib/api";

const COUNTRY_COLORS: Record<string, string> = {
  BG: "#059669",
  RO: "#3b82f6",
  EU27_2020: "#8b5cf6",
  EL: "#f97316",
};

const COMPONENT_COLORS: Record<string, string> = {
  B1GQ: "#059669",
  P31_S14: "#3b82f6",
  P51G: "#f97316",
  P6: "#8b5cf6",
  P7: "#ef4444",
};

const COMPONENT_ICONS: Record<string, typeof ShoppingCart> = {
  P31_S14: ShoppingCart,
  P51G: Factory,
  P6: Plane,
  P7: Package,
};

function formatQuarter(q: string): string {
  return q.replace(/^(\d{4})-Q(\d)$/, (_, y, qn) => `Q${qn} ${y.slice(2)}`);
}

export function GdpDashboard() {
  const [gdp, setGdp] = useState<GdpGrowthData | null>(null);
  const [comparison, setComparison] = useState<GdpComparisonData | null>(null);
  const [expenditure, setExpenditure] = useState<GdpExpenditureData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGdpGrowth(), fetchGdpComparison(), fetchGdpExpenditure()]).then(([g, c, e]) => {
      setGdp(g);
      setComparison(c);
      setExpenditure(e);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted" />
        <span className="text-muted">Зареждане на данни от Eurostat...</span>
      </div>
    );
  }

  const latest = gdp?.quarters[gdp.quarters.length - 1];
  const previous = gdp?.quarters && gdp.quarters.length >= 2 ? gdp.quarters[gdp.quarters.length - 2] : null;
  const isGrowing = latest && latest.value > 0;

  // Chart data for BG GDP over time
  const bgChartData = (gdp?.quarters || []).map((q) => ({
    period: formatQuarter(q.period),
    "Растеж (%)": parseFloat(q.value.toFixed(1)),
  }));

  // Comparison bar chart — latest quarter for each country
  const comparisonBarData = (comparison?.countries || []).map((c) => {
    const latestQ = c.quarters[c.quarters.length - 1];
    return {
      name: c.label,
      geo: c.geo,
      value: latestQ ? parseFloat(latestQ.value.toFixed(1)) : 0,
      period: latestQ?.period || "",
    };
  }).sort((a, b) => b.value - a.value);

  // Comparison line chart — all quarters
  const allPeriods = new Set<string>();
  for (const c of comparison?.countries || []) {
    for (const q of c.quarters) allPeriods.add(q.period);
  }
  const comparisonLineData = Array.from(allPeriods).sort().map((period) => {
    const point: Record<string, string | number | null> = { period: formatQuarter(period) };
    for (const c of comparison?.countries || []) {
      const q = c.quarters.find((x) => x.period === period);
      point[c.label] = q ? parseFloat(q.value.toFixed(1)) : null;
    }
    return point;
  });

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Latest growth */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          {isGrowing ? (
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-500" />
          ) : (
            <TrendingDown className="mx-auto mb-2 h-8 w-8 text-red-500" />
          )}
          <p className="text-sm text-muted">Последен растеж (г/г)</p>
          <p className={`text-3xl font-bold ${isGrowing ? "text-green-600" : "text-red-600"}`}>
            {latest ? `${latest.value > 0 ? "+" : ""}${latest.value.toFixed(1)}%` : "—"}
          </p>
          <p className="text-xs text-muted">{latest ? formatQuarter(latest.period) : ""}</p>
        </div>

        {/* Previous quarter */}
        {previous && (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-sm text-muted">Предходно тримесечие</p>
            <p className={`text-3xl font-bold ${previous.value > 0 ? "text-green-600" : "text-red-600"}`}>
              {previous.value > 0 ? "+" : ""}{previous.value.toFixed(1)}%
            </p>
            <p className="text-xs text-muted">{formatQuarter(previous.period)}</p>
          </div>
        )}

        {/* Trend */}
        {latest && previous && (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <p className="text-sm text-muted">Тенденция</p>
            {latest.value > previous.value ? (
              <>
                <TrendingUp className="mx-auto mb-1 h-6 w-6 text-green-500" />
                <p className="text-lg font-bold text-green-600">Ускоряване</p>
              </>
            ) : latest.value < previous.value ? (
              <>
                <TrendingDown className="mx-auto mb-1 h-6 w-6 text-yellow-500" />
                <p className="text-lg font-bold text-yellow-600">Забавяне</p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-500">Стабилно</p>
            )}
            <p className="text-xs text-muted">
              {(latest.value - previous.value) > 0 ? "+" : ""}
              {(latest.value - previous.value).toFixed(1)} пр.п.
            </p>
          </div>
        )}
      </div>

      {/* Data source label */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Info className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-text">
          <strong>Източник:</strong>{" "}
          <a
            href="https://ec.europa.eu/eurostat/databrowser/product/view/namq_10_gdp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Eurostat
          </a>
          {" "}(namq_10_gdp)
          {" "}| Обновяване: <strong>автоматично, всеки ден</strong>
          {" "}| Сезонно изгладени данни, верижни обеми
        </p>
      </div>

      {/* BG GDP growth chart */}
      {bgChartData.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-text">Растеж на БВП на България (г/г, %)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bgChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, "Растеж"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="Растеж (%)" radius={[4, 4, 0, 0]}>
                  {bgChartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry["Растеж (%)"] >= 0 ? "#059669" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ROOT-CAUSE ANALYSIS — Expenditure decomposition */}
      {expenditure && expenditure.components.length > 0 && (() => {
        // Exclude B1GQ (total GDP) for the component breakdown
        const components = expenditure.components.filter((c) => c.code !== "B1GQ");
        const gdpTotal = expenditure.components.find((c) => c.code === "B1GQ");

        // Latest quarter data for bar chart
        const latestBarData = components.map((c) => {
          const latest = c.quarters[c.quarters.length - 1];
          return {
            name: c.label,
            code: c.code,
            value: latest ? parseFloat(latest.value.toFixed(1)) : 0,
            period: latest?.period || "",
          };
        });

        const latestPeriod = latestBarData[0]?.period;

        // Line chart data: all components over time
        const allTimePeriods = new Set<string>();
        for (const c of expenditure.components) {
          for (const q of c.quarters) allTimePeriods.add(q.period);
        }
        const expenditureLineData = Array.from(allTimePeriods).sort().map((period) => {
          const point: Record<string, string | number | null> = { period: formatQuarter(period) };
          for (const c of expenditure.components) {
            const q = c.quarters.find((x) => x.period === period);
            point[c.label] = q ? parseFloat(q.value.toFixed(1)) : null;
          }
          return point;
        });

        // Find strongest driver and weakest
        const sorted = [...latestBarData].sort((a, b) => b.value - a.value);
        const strongest = sorted[0];
        const weakest = sorted[sorted.length - 1];

        // GDP total latest
        const gdpLatest = gdpTotal?.quarters[gdpTotal.quarters.length - 1];
        const gdpPrev = gdpTotal?.quarters && gdpTotal.quarters.length >= 2
          ? gdpTotal.quarters[gdpTotal.quarters.length - 2]
          : null;

        return (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <div className="mb-5 flex items-center gap-2">
              <SearchCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-text">
                Какво движи растежа на БВП?
              </h3>
            </div>

            <div className="space-y-5">
              {/* Summary cards */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {components.map((c) => {
                  const latest = c.quarters[c.quarters.length - 1];
                  const prev = c.quarters.length >= 2 ? c.quarters[c.quarters.length - 2] : null;
                  if (!latest) return null;
                  const isUp = latest.value > 0;
                  const Icon = COMPONENT_ICONS[c.code] || BarChart3;
                  const trend = prev ? latest.value - prev.value : 0;
                  return (
                    <div
                      key={c.code}
                      className="rounded-xl border border-border bg-white p-4 text-center"
                    >
                      <Icon className="mx-auto mb-1.5 h-5 w-5" style={{ color: COMPONENT_COLORS[c.code] }} />
                      <p className="text-xs text-muted mb-1">{c.label}</p>
                      <p className={`text-2xl font-bold ${isUp ? "text-green-600" : "text-red-600"}`}>
                        {latest.value > 0 ? "+" : ""}{latest.value.toFixed(1)}%
                      </p>
                      {prev && (
                        <p className={`text-[10px] ${trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-400"}`}>
                          {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend).toFixed(1)} пр.п. vs {formatQuarter(prev.period)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bar chart — latest quarter components */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-text">
                  Растеж по компоненти — {latestPeriod ? formatQuarter(latestPeriod) : ""}
                  {gdpLatest && (
                    <span className="ml-2 text-xs font-normal text-muted">
                      (БВП общо: {gdpLatest.value > 0 ? "+" : ""}{gdpLatest.value.toFixed(1)}%)
                    </span>
                  )}
                </h4>
                <div className="space-y-2">
                  {sorted.map((item) => {
                    const maxAbs = Math.max(...latestBarData.map((d) => Math.abs(d.value)), 1);
                    const widthPct = (Math.abs(item.value) / maxAbs) * 100;
                    const isPositive = item.value >= 0;
                    return (
                      <div key={item.code} className="flex items-center gap-3">
                        <span className="w-44 shrink-0 text-sm text-text truncate">
                          {item.name}
                        </span>
                        <div className="flex-1 rounded-full bg-gray-100 h-5 relative overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full ${isPositive ? "bg-green-400/70" : "bg-red-400/70"}`}
                            style={{ width: `${Math.max(widthPct, 4)}%` }}
                          />
                          <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-text">
                            {item.value > 0 ? "+" : ""}{item.value.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Line chart — trends over time */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-text">
                  Динамика по компоненти (г/г, %)
                </h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expenditureLineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="period" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} />
                      <Tooltip
                        formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
                        contentStyle={{ fontSize: 12 }}
                        itemStyle={{ padding: "2px 0" }}
                      />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                      {expenditure.components.map((c) => (
                        <Line
                          key={c.code}
                          type="monotone"
                          dataKey={c.label}
                          stroke={COMPONENT_COLORS[c.code] || "#9ca3af"}
                          strokeWidth={c.code === "B1GQ" ? 2.5 : 1.5}
                          dot={c.code === "B1GQ"}
                          strokeDasharray={c.code === "B1GQ" ? undefined : c.code === "P7" ? "4 4" : undefined}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Insight cards */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Strongest driver */}
                {strongest && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-text">Основен двигател</span>
                    </div>
                    <p className="text-xs text-muted">
                      <strong className="text-green-700">{strongest.name}</strong> расте
                      с <strong className="text-green-700">+{strongest.value.toFixed(1)}%</strong> (г/г).
                      {strongest.code === "P31_S14" && " Домакинствата харчат повече — добър знак за вътрешното търсене."}
                      {strongest.code === "P51G" && " Повече инвестиции означават бъдещ капацитет и работни места."}
                      {strongest.code === "P6" && " Силният износ показва конкурентоспособна икономика."}
                    </p>
                  </div>
                )}

                {/* Weakest / drag */}
                {weakest && (
                  <div className={`rounded-xl border p-4 ${weakest.value < 0 ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className={`h-4 w-4 ${weakest.value < 0 ? "text-red-600" : "text-yellow-600"}`} />
                      <span className="text-sm font-medium text-text">
                        {weakest.value < 0 ? "Спад" : "Най-бавен растеж"}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      <strong className={weakest.value < 0 ? "text-red-700" : "text-yellow-700"}>
                        {weakest.name}
                      </strong>{" "}
                      {weakest.value < 0
                        ? `намалява с ${weakest.value.toFixed(1)}%.`
                        : `расте най-бавно: +${weakest.value.toFixed(1)}%.`}
                      {weakest.code === "P7" && weakest.value < 0 && " Спад на вноса може да означава по-слабо вътрешно търсене, но подобрява нетния износ."}
                      {weakest.code === "P51G" && weakest.value < 0 && " Спад на инвестициите е тревожен сигнал за бъдещия растеж."}
                    </p>
                  </div>
                )}

                {/* GDP momentum */}
                {gdpLatest && gdpPrev && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-text">Импулс на БВП</span>
                    </div>
                    <p className="text-xs text-muted">
                      Растежът {gdpLatest.value > gdpPrev.value ? "се ускорява" : gdpLatest.value < gdpPrev.value ? "се забавя" : "е стабилен"}:{" "}
                      <strong className="text-text">
                        {gdpLatest.value > 0 ? "+" : ""}{gdpLatest.value.toFixed(1)}%
                      </strong>{" "}
                      в {formatQuarter(gdpLatest.period)} vs{" "}
                      <strong className="text-text">
                        {gdpPrev.value > 0 ? "+" : ""}{gdpPrev.value.toFixed(1)}%
                      </strong>{" "}
                      в {formatQuarter(gdpPrev.period)}.
                    </p>
                  </div>
                )}
              </div>

              {/* What it means — plain language */}
              <div className="rounded-lg border border-border bg-white px-4 py-3">
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-text">Какво означава това за мен?</strong>{" "}
                  БВП измерва общата стойност на произведеното в страната. Когато{" "}
                  <em>потреблението на домакинствата</em> расте — хората имат повече пари и ги харчат.{" "}
                  <em>Инвестициите</em> показват доверие на бизнеса в бъдещето.{" "}
                  <em>Износът</em> означава търсене на българска продукция навън, а{" "}
                  <em>вносът</em> — колко чужди стоки купуваме. По-бързият растеж обикновено
                  означава повече работни места и по-високи заплати — но и по-висока инфлация.
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Comparison: BG vs neighbours */}
      {comparisonBarData.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-text">
              България vs съседи — последно тримесечие
              {comparisonBarData[0]?.period ? ` (${formatQuarter(comparisonBarData[0].period)})` : ""}
            </h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, "Растеж"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {comparisonBarData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={COUNTRY_COLORS[entry.geo] || "#9ca3af"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Comparison line chart */}
      {comparisonLineData.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-4 font-semibold text-text">Динамика на растежа — България и съседи</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
                  contentStyle={{ fontSize: 12 }}
                  itemStyle={{ padding: "2px 0" }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                {(comparison?.countries || []).map((c) => (
                  <Line
                    key={c.geo}
                    type="monotone"
                    dataKey={c.label}
                    stroke={COUNTRY_COLORS[c.geo] || "#9ca3af"}
                    strokeWidth={c.geo === "BG" ? 2.5 : 1.5}
                    dot={c.geo === "BG"}
                    strokeDasharray={c.geo === "EU27_2020" ? "6 3" : undefined}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted">
            Годишна промяна на реалния БВП (%), сезонно изгладени данни. Източник: Eurostat namq_10_gdp.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted">
        Данните се обновяват автоматично от Eurostat (revalidate: 24 часа).
        Стойностите са сезонно и календарно изгладени, верижни обеми, % промяна спрямо същото тримесечие на предходната година.
      </p>
    </div>
  );
}
