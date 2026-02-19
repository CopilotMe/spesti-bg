"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Thermometer,
  Loader2,
  Flame,
  Zap,
  Wind,
  MapPin,
  Info,
  Trophy,
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
  LineChart,
  Line,
  Cell,
} from "recharts";
import { fetchWeather, type WeatherData } from "@/lib/api";

const CITIES = [
  { key: "sofia", label: "София" },
  { key: "plovdiv", label: "Пловдив" },
  { key: "varna", label: "Варна" },
  { key: "burgas", label: "Бургас" },
];

// Average electricity price (single tariff, incl. VAT) in EUR/kWh
const ELECTRICITY_RATE = 0.1359 * 1.2;

// Average gas price for heating (EUR/m³ incl. VAT)
// Overgas pricePerM3 + fees ≈ 0.62 EUR/m³ + 20% VAT
const GAS_RATE_PER_M3 = 0.62 * 1.2;

// Calorific value: 1 m³ gas ≈ 10.5 kWh thermal
const GAS_KWH_PER_M3 = 10.5;

// Efficiency of different heating methods
const EFFICIENCY = {
  convector: 1.0, // 100% electric resistance
  gasBoiler: 0.92, // 92% condensing boiler
  heatPump: 3.5, // COP 3.5 (air-to-air)
};

// Typical heating need: kWh per heating degree day per 80m² apartment
const KWH_PER_HDD = 3.2; // Approximate for 80m² moderately insulated apartment

function calculateHeatingDays(forecast: WeatherData["forecast"]): number {
  return forecast.filter((d) => (d.min + d.max) / 2 < 15).length;
}

function calculateHDD(forecast: WeatherData["forecast"]): number {
  // Heating Degree Days: sum of (18 - avgTemp) for days where avgTemp < 18
  return forecast.reduce((sum, d) => {
    const avg = (d.min + d.max) / 2;
    return avg < 18 ? sum + (18 - avg) : sum;
  }, 0);
}

interface HeatingCost {
  method: string;
  icon: typeof Zap;
  monthlyEur: number;
  costPerKwh: number;
  color: string;
}

export function HeatingCostDashboard() {
  const [city, setCity] = useState("sofia");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState(80);

  useEffect(() => {
    setLoading(true);
    fetchWeather(city).then((w) => {
      setWeather(w);
      setLoading(false);
    });
  }, [city]);

  const results = useMemo(() => {
    if (!weather) return null;

    const hdd = calculateHDD(weather.forecast);
    const heatingDays = calculateHeatingDays(weather.forecast);
    // Scale from 7-day to monthly (×30/7)
    const monthlyHDD = (hdd / 7) * 30;
    const scaleFactor = area / 80; // adjust for apartment size
    const monthlyKwhNeed = monthlyHDD * KWH_PER_HDD * scaleFactor;

    const methods: HeatingCost[] = [
      {
        method: "Конвектор (ток)",
        icon: Zap,
        monthlyEur:
          (monthlyKwhNeed / EFFICIENCY.convector) * ELECTRICITY_RATE,
        costPerKwh: ELECTRICITY_RATE / EFFICIENCY.convector,
        color: "#f59e0b",
      },
      {
        method: "Газов котел",
        icon: Flame,
        monthlyEur:
          (monthlyKwhNeed / EFFICIENCY.gasBoiler / GAS_KWH_PER_M3) *
          GAS_RATE_PER_M3,
        costPerKwh:
          GAS_RATE_PER_M3 / GAS_KWH_PER_M3 / EFFICIENCY.gasBoiler,
        color: "#ef4444",
      },
      {
        method: "Климатик (термопомпа)",
        icon: Wind,
        monthlyEur:
          (monthlyKwhNeed / EFFICIENCY.heatPump) * ELECTRICITY_RATE,
        costPerKwh: ELECTRICITY_RATE / EFFICIENCY.heatPump,
        color: "#059669",
      },
    ];

    return { methods, monthlyKwhNeed, heatingDays, hdd: monthlyHDD };
  }, [weather, area]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-muted">Зареждане на метеорологични данни...</span>
      </div>
    );
  }

  if (!weather || !results) {
    return (
      <p className="py-16 text-center text-muted">
        Няма налични данни. Опитайте отново по-късно.
      </p>
    );
  }

  const cheapest = results.methods.reduce((a, b) =>
    a.monthlyEur < b.monthlyEur ? a : b,
  );

  const chartData = results.methods.map((m) => ({
    name: m.method.split(" (")[0],
    cost: Math.round(m.monthlyEur * 100) / 100,
  }));

  const forecastData = weather.forecast.map((d) => ({
    date: d.date.slice(5), // "MM-DD"
    min: d.min,
    max: d.max,
    avg: Math.round(((d.min + d.max) / 2) * 10) / 10,
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            <MapPin className="mr-1 inline h-4 w-4" />
            Град
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          >
            {CITIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Площ на жилището (m²)
          </label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(Math.max(20, Number(e.target.value)))}
            min={20}
            max={300}
            className="w-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          />
        </div>
      </div>

      {/* Current weather */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2 mb-3">
          <Thermometer className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-text">Текущо време</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <span className="text-muted">Температура</span>
            <p className="text-lg font-bold text-text">
              {weather.currentTemp.toFixed(1)}°C
            </p>
          </div>
          <div>
            <span className="text-muted">Усеща се като</span>
            <p className="text-lg font-bold text-text">
              {weather.feelsLike.toFixed(1)}°C
            </p>
          </div>
          <div>
            <span className="text-muted">Влажност</span>
            <p className="text-lg font-bold text-text">{weather.humidity}%</p>
          </div>
          <div>
            <span className="text-muted">Дни за отопление (7 д.)</span>
            <p className="text-lg font-bold text-text">
              {results.heatingDays} от 7
            </p>
          </div>
        </div>
      </div>

      {/* 7-day forecast chart */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 font-semibold text-text">
          7-дневна прогноза
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis unit="°C" fontSize={12} />
            <Tooltip
              formatter={(v) => `${Number(v).toFixed(1)}°C`}
            />
            <Legend />
            <Line
              dataKey="max"
              name="Макс."
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="min"
              name="Мин."
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Heating cost comparison */}
      <div className="grid gap-4 sm:grid-cols-3">
        {results.methods.map((m) => {
          const Icon = m.icon;
          const isCheapest = m === cheapest;
          return (
            <div
              key={m.method}
              className={`rounded-xl border p-5 ${isCheapest ? "border-primary bg-primary/5" : "border-border bg-surface"}`}
            >
              {isCheapest && (
                <div className="mb-2 flex items-center gap-1 text-xs font-medium text-primary">
                  <Trophy className="h-3.5 w-3.5" />
                  Най-изгоден
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5" style={{ color: m.color }} />
                <span className="font-medium text-text">{m.method}</span>
              </div>
              <p className="text-2xl font-bold text-text">
                {m.monthlyEur.toFixed(2)} <span className="text-sm font-normal text-muted">EUR/мес.</span>
              </p>
              <p className="mt-1 text-xs text-muted">
                {(m.costPerKwh * 100).toFixed(2)} ст./kWh топлина
              </p>
            </div>
          );
        })}
      </div>

      {/* Bar chart comparison */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 font-semibold text-text">
          Месечна цена на отопление (EUR)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis unit=" EUR" fontSize={12} />
            <Tooltip formatter={(v) => `${Number(v).toFixed(2)} EUR`} />
            <Bar dataKey="cost" name="Месечна цена" radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={results.methods[i].color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Methodology note */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted space-y-1">
            <p>
              <strong className="text-text">Методология:</strong> Изчислението
              използва 7-дневната прогноза и градусо-денови (HDD) за отопление.
              Предполагаме средно изолиран апартамент ({area} m²).
            </p>
            <p>
              Цена на тока: {(ELECTRICITY_RATE * 100).toFixed(2)} ст./kWh (с ДДС).
              Цена на газ: {(GAS_RATE_PER_M3 * 100).toFixed(1)} ст./m³ (с ДДС).
              COP на климатик: {EFFICIENCY.heatPump}. КПД на газов котел:{" "}
              {(EFFICIENCY.gasBoiler * 100).toFixed(0)}%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

