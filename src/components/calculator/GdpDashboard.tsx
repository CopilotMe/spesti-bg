"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Info,
  Loader2,
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
  type GdpGrowthData,
  type GdpComparisonData,
} from "@/lib/api";

const COUNTRY_COLORS: Record<string, string> = {
  BG: "#059669",
  RO: "#3b82f6",
  EU27_2020: "#8b5cf6",
  EL: "#f97316",
};

function formatQuarter(q: string): string {
  return q.replace(/^(\d{4})-Q(\d)$/, (_, y, qn) => `Q${qn} ${y.slice(2)}`);
}

export function GdpDashboard() {
  const [gdp, setGdp] = useState<GdpGrowthData | null>(null);
  const [comparison, setComparison] = useState<GdpComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGdpGrowth(), fetchGdpComparison()]).then(([g, c]) => {
      setGdp(g);
      setComparison(c);
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
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, ""]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
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
