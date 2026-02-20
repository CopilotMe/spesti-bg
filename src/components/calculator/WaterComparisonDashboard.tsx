"use client";

import { useState, useMemo } from "react";
import {
  Droplets,
  MapPin,
  TrendingDown,
  Info,
  Trophy,
  ArrowUpDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { waterProviders } from "@/data/water";

export function WaterComparisonDashboard() {
  const [consumptionM3, setConsumptionM3] = useState(5);
  const [selectedCity, setSelectedCity] = useState("sofiyska_voda");

  const sortedByTotal = useMemo(() => {
    return [...waterProviders].sort(
      (a, b) => a.totalRateWithVat * consumptionM3 - b.totalRateWithVat * consumptionM3,
    );
  }, [consumptionM3]);

  const cheapest = sortedByTotal[0];
  const mostExpensive = sortedByTotal[sortedByTotal.length - 1];
  const selectedProvider = waterProviders.find((p) => p.id === selectedCity)!;

  const savingsPerMonth =
    (selectedProvider.totalRateWithVat - cheapest.totalRateWithVat) *
    consumptionM3;

  const rankChartData = useMemo(() => {
    return sortedByTotal.map((p) => ({
      city: p.city,
      id: p.id,
      cost: Math.round(p.totalRateWithVat * consumptionM3 * 100) / 100,
    }));
  }, [sortedByTotal, consumptionM3]);

  const stackedChartData = useMemo(() => {
    return sortedByTotal.map((p) => ({
      city: p.city,
      id: p.id,
      supply: Math.round(p.supplyRate * consumptionM3 * 100) / 100,
      sewerage: Math.round(p.sewerageRate * consumptionM3 * 100) / 100,
      treatment: Math.round(p.treatmentRate * consumptionM3 * 100) / 100,
    }));
  }, [sortedByTotal, consumptionM3]);

  function handleConsumptionChange(delta: number) {
    setConsumptionM3((prev) => Math.max(1, Math.min(30, prev + delta)));
  }

  return (
    <div className="space-y-6">
      {/* Input controls */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            <Droplets className="mr-1 inline h-4 w-4" />
            Месечна консумация (m³)
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleConsumptionChange(-1)}
              disabled={consumptionM3 <= 1}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text hover:bg-primary/10 disabled:opacity-40"
            >
              −
            </button>
            <input
              type="number"
              value={consumptionM3}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= 1 && v <= 30) setConsumptionM3(v);
              }}
              min={1}
              max={30}
              className="w-20 rounded-lg border border-border bg-surface px-3 py-2 text-center text-sm text-text"
            />
            <button
              onClick={() => handleConsumptionChange(1)}
              disabled={consumptionM3 >= 30}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text hover:bg-primary/10 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            <MapPin className="mr-1 inline h-4 w-4" />
            Вашият град
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          >
            {waterProviders.map((p) => (
              <option key={p.id} value={p.id}>
                {p.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Cheapest */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-primary">
            <Trophy className="h-3.5 w-3.5" />
            Най-евтина вода
          </div>
          <p className="text-lg font-bold text-text">{cheapest.city}</p>
          <p className="text-sm text-muted">
            {cheapest.totalRateWithVat.toFixed(2)} EUR/m³
          </p>
        </div>

        {/* Most expensive */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-red-500">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Най-скъпа вода
          </div>
          <p className="text-lg font-bold text-text">{mostExpensive.city}</p>
          <p className="text-sm text-muted">
            {mostExpensive.totalRateWithVat.toFixed(2)} EUR/m³
          </p>
        </div>

        {/* Savings potential */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingDown className="h-3.5 w-3.5" />
            Потенциал за спестяване
          </div>
          {savingsPerMonth > 0.005 ? (
            <p className="text-sm text-text">
              Ако живеехте в <strong>{cheapest.city}</strong> вместо в{" "}
              <strong>{selectedProvider.city}</strong>, щяхте да спестявате{" "}
              <strong className="text-primary">
                {savingsPerMonth.toFixed(2)} EUR/мес.
              </strong>
            </p>
          ) : (
            <p className="text-sm text-text">
              Вече живеете в града с най-евтина вода!
            </p>
          )}
        </div>
      </div>

      {/* Horizontal bar chart — total monthly cost */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 font-semibold text-text">
          Месечна сметка за вода по градове ({consumptionM3} m³)
        </h2>
        <ResponsiveContainer width="100%" height={700}>
          <BarChart data={rankChartData} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit=" EUR" fontSize={12} />
            <YAxis
              type="category"
              dataKey="city"
              fontSize={12}
              width={110}
              tick={{ fill: "currentColor" }}
            />
            <Tooltip formatter={(v) => `${Number(v).toFixed(2)} EUR`} />
            <Bar dataKey="cost" name="Месечна сметка" radius={[0, 6, 6, 0]}>
              {rankChartData.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={entry.id === selectedCity ? "#059669" : "#cbd5e1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked bar chart — cost breakdown */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 font-semibold text-text">
          Структура на цената: доставка, канализация, пречистване
        </h2>
        <ResponsiveContainer width="100%" height={700}>
          <BarChart data={stackedChartData} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit=" EUR" fontSize={12} />
            <YAxis
              type="category"
              dataKey="city"
              fontSize={12}
              width={110}
              tick={{ fill: "currentColor" }}
            />
            <Tooltip formatter={(v) => `${Number(v).toFixed(2)} EUR`} />
            <Legend />
            <Bar
              dataKey="supply"
              name="Доставка"
              stackId="a"
              fill="#3b82f6"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="sewerage"
              name="Канализация"
              stackId="a"
              fill="#f59e0b"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="treatment"
              name="Пречистване"
              stackId="a"
              fill="#14b8a6"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Selected city detail card */}
      <div className="rounded-xl border border-primary bg-primary/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-text">
            {selectedProvider.city} — {selectedProvider.name}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <span className="text-muted">Доставка</span>
            <p className="text-lg font-bold text-text">
              {selectedProvider.supplyRate.toFixed(2)}{" "}
              <span className="text-sm font-normal text-muted">EUR/m³</span>
            </p>
          </div>
          <div>
            <span className="text-muted">Канализация</span>
            <p className="text-lg font-bold text-text">
              {selectedProvider.sewerageRate.toFixed(2)}{" "}
              <span className="text-sm font-normal text-muted">EUR/m³</span>
            </p>
          </div>
          <div>
            <span className="text-muted">Пречистване</span>
            <p className="text-lg font-bold text-text">
              {selectedProvider.treatmentRate.toFixed(2)}{" "}
              <span className="text-sm font-normal text-muted">EUR/m³</span>
            </p>
          </div>
          <div>
            <span className="text-muted">Обща цена с ДДС</span>
            <p className="text-lg font-bold text-primary">
              {selectedProvider.totalRateWithVat.toFixed(2)}{" "}
              <span className="text-sm font-normal text-muted">EUR/m³</span>
            </p>
          </div>
          <div>
            <span className="text-muted">Месечна сметка ({consumptionM3} m³)</span>
            <p className="text-lg font-bold text-text">
              {(selectedProvider.totalRateWithVat * consumptionM3).toFixed(2)}{" "}
              <span className="text-sm font-normal text-muted">EUR</span>
            </p>
          </div>
          {selectedProvider.url && (
            <div>
              <span className="text-muted">Уебсайт</span>
              <p className="text-sm">
                <a
                  href={selectedProvider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {selectedProvider.name}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Methodology note */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted space-y-1">
            <p>
              <strong className="text-text">Методология:</strong> Цените на
              водата са от регулаторните решения на КЕВР (Комисия за енергийно
              и водно регулиране). Всички стойности са в EUR (1 EUR = 1.95583 BGN)
              и включват ДДС (20%).
            </p>
            <p>
              Общата цена включва три компонента: доставка на питейна вода,
              отвеждане (канализация) и пречистване на отпадъчни води. Реалната
              ви сметка може да варира при наличие на фиксирани такси или
              отстъпки за социално слаби потребители.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
