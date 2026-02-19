"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Info, TrendingDown, TrendingUp, Globe } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  fetchEnergyPriceComparison,
  fetchMinimumWages,
  fetchLabourCosts,
  fetchInflationDashboard,
} from "@/lib/api";
import type {
  EnergyPriceComparison,
  MinimumWageData,
  LabourCostData,
  InflationDashboardData,
} from "@/lib/api";

const COUNTRY_COLORS: Record<string, string> = {
  BG: "#059669",
  RO: "#3b82f6",
  DE: "#f59e0b",
  EL: "#8b5cf6",
  HR: "#ef4444",
  EU27_2020: "#6b7280",
};

function formatPeriod(p: string): string {
  const [y, m] = p.split("-");
  const months: Record<string, string> = {
    "01": "Яну",
    "02": "Фев",
    "03": "Мар",
    "04": "Апр",
    "05": "Май",
    "06": "Юни",
    "07": "Юли",
    "08": "Авг",
    "09": "Сеп",
    "10": "Окт",
    "11": "Ное",
    "12": "Дек",
  };
  return `${months[m] || m} ${y?.slice(2)}`;
}

export function EuComparisonDashboard() {
  const [energy, setEnergy] = useState<EnergyPriceComparison | null>(null);
  const [wages, setWages] = useState<MinimumWageData | null>(null);
  const [labour, setLabour] = useState<LabourCostData | null>(null);
  const [inflation, setInflation] = useState<InflationDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchEnergyPriceComparison(),
      fetchMinimumWages(),
      fetchLabourCosts(),
      fetchInflationDashboard(),
    ])
      .then(([e, w, l, i]) => {
        setEnergy(e);
        setWages(w);
        setLabour(l);
        setInflation(i);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- Derived data ---------- */

  const latestWages = useMemo(() => {
    if (!wages) return [];
    return wages.countries
      .map((c) => ({
        country: c.label,
        geo: c.geo,
        wage: c.periods[c.periods.length - 1]?.value ?? 0,
      }))
      .sort((a, b) => a.wage - b.wage);
  }, [wages]);

  const wageHistory = useMemo(() => {
    if (!wages) return [];
    // Build time series: each period as a row
    const bgData = wages.countries.find((c) => c.geo === "BG");
    if (!bgData) return [];
    return bgData.periods.slice(-10).map((p) => {
      const row: Record<string, string | number> = { period: p.period };
      wages.countries.forEach((c) => {
        const match = c.periods.find((cp) => cp.period === p.period);
        row[c.label] = match?.value ?? 0;
      });
      return row;
    });
  }, [wages]);

  const labourChartData = useMemo(() => {
    if (!labour) return [];
    return labour.totalPerHour
      .map((c) => ({
        country: c.label,
        geo: c.geo,
        cost: c.value,
      }))
      .sort((a, b) => a.cost - b.cost);
  }, [labour]);

  const bgVsEuChart = useMemo(() => {
    if (!inflation?.bgVsEu) return [];
    return inflation.bgVsEu
      .filter((d) => d.bg != null || d.eu != null)
      .map((d) => ({
        period: formatPeriod(d.period),
        "България": d.bg,
        "ЕС средно": d.eu,
      }));
  }, [inflation]);

  // Energy: BG savings vs EU
  const bgEnergy = energy?.prices.find((c) => c.country === "BG");
  const euEnergy = energy?.prices.find((c) => c.country === "EU27_2020");
  const energySaving =
    bgEnergy && euEnergy && euEnergy.eurPerKwh > 0
      ? ((euEnergy.eurPerKwh - bgEnergy.eurPerKwh) / euEnergy.eurPerKwh) * 100
      : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-muted">Зареждане на данни от Eurostat...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ---- Data source ---- */}
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
        <Globe className="h-4 w-4 shrink-0" />
        Данни от Eurostat, обновявани автоматично на всеки 24 часа
      </div>

      {/* ---- Hero cards ---- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {latestWages.find((c) => c.geo === "BG") && (
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {latestWages.find((c) => c.geo === "BG")?.wage.toFixed(0)} &euro;
            </div>
            <div className="text-xs text-muted">МРЗ в България</div>
          </div>
        )}
        {bgEnergy && (
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {(bgEnergy.eurPerKwh * 100).toFixed(1)} цента
            </div>
            <div className="text-xs text-muted">Ток (EUR/kWh)</div>
          </div>
        )}
        {energySaving != null && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
              <TrendingDown className="h-5 w-5" />
              {energySaving.toFixed(0)}%
            </div>
            <div className="text-xs text-muted">По-евтин ток от ЕС средно</div>
          </div>
        )}
        {inflation?.bgVsEu && inflation.bgVsEu.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            {(() => {
              const latest = inflation.bgVsEu[inflation.bgVsEu.length - 1];
              const val = latest?.bg;
              return (
                <>
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-text">
                    {val != null && val > 0 ? (
                      <TrendingUp className="h-5 w-5 text-red-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-green-500" />
                    )}
                    {val?.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted">
                    Инфлация BG ({latest?.period})
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* ---- Minimum wages bar chart ---- */}
      {latestWages.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-bold text-text">
            Минимална заплата в ЕС (EUR/месец)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latestWages}>
                <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(0)} €`, "МРЗ"]}
                />
                <Bar dataKey="wage" radius={[4, 4, 0, 0]}>
                  {latestWages.map((d) => (
                    <Cell
                      key={d.geo}
                      fill={COUNTRY_COLORS[d.geo] || "#d1d5db"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ---- Wage history line chart ---- */}
      {wageHistory.length > 0 && wages && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-bold text-text">
            Тренд на минималната заплата (последните 5 години)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wageHistory}>
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                {wages.countries.map((c) => (
                  <Line
                    key={c.geo}
                    dataKey={c.label}
                    stroke={COUNTRY_COLORS[c.geo] || "#999"}
                    strokeWidth={c.geo === "BG" ? 3 : 1.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ---- Energy prices ---- */}
      {energy && energy.prices.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-bold text-text">
            Цена на електричество (EUR/kWh)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={energy.prices
                  .map((c) => ({
                    country: c.label,
                    geo: c.country,
                    price: c.eurPerKwh,
                  }))
                  .sort((a, b) => a.price - b.price)}
              >
                <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [
                    `${(Number(v) * 100).toFixed(1)} цента/kWh`,
                    "Цена",
                  ]}
                />
                <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                  {energy.prices
                    .sort((a, b) => a.eurPerKwh - b.eurPerKwh)
                    .map((d) => (
                      <Cell
                        key={d.country}
                        fill={COUNTRY_COLORS[d.country] || "#d1d5db"}
                      />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ---- Labour costs ---- */}
      {labourChartData.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-bold text-text">
            Часова цена на труда (EUR/час)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={labourChartData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="country"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(1)} €/час`, "Цена"]}
                />
                <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                  {labourChartData.map((d) => (
                    <Cell
                      key={d.geo}
                      fill={COUNTRY_COLORS[d.geo] || "#d1d5db"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ---- Inflation BG vs EU ---- */}
      {bgVsEuChart.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-bold text-text">
            Инфлация: България vs ЕС средно (годишна промяна, %)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bgVsEuChart}>
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="България"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  dataKey="ЕС средно"
                  stroke="#6b7280"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ---- Explainer ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-2 text-sm text-muted">
            <h3 className="font-semibold text-text">
              Защо България е най-евтина, но и с най-ниски доходи?
            </h3>
            <p>
              България има най-ниските цени на електричество и много ниски цени
              на храна в ЕС. Но минималната заплата също е най-ниската.
              Реалната покупателна способност (PPP) на българина е по-висока от
              номиналното сравнение, но все още значително под средната за ЕС.
            </p>
            <p>
              Виж{" "}
              <a
                href="/kupuvatelna-sposobnost"
                className="font-medium text-primary hover:underline"
              >
                покупателната способност
              </a>{" "}
              за конкретен анализ какво купува заплатата ти.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
