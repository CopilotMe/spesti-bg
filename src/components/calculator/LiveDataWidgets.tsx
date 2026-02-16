"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Thermometer,
  Wind,
  Droplets,
  BarChart3,
  Leaf,
  Globe,
  Loader2,
} from "lucide-react";
import {
  fetchHicpData,
  fetchEnergyPriceComparison,
  fetchWeather,
  fetchEcbRate,
  fetchAirQuality,
  type HicpSeries,
  type EnergyPriceComparison,
  type WeatherData,
  type EcbRate,
  type AirQuality,
} from "@/lib/api";
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
  Legend,
} from "recharts";

// ---- HICP Inflation Trends ----

export function HicpTrendsWidget() {
  const [data, setData] = useState<HicpSeries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHicpData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <WidgetSkeleton title="Инфлация по комунални услуги" />;
  if (!data) return null;

  // Build combined chart data
  const allPeriods = new Set<string>();
  for (const key of Object.keys(data) as (keyof HicpSeries)[]) {
    for (const dp of data[key]) allPeriods.add(dp.period);
  }

  const chartData = Array.from(allPeriods)
    .sort()
    .map((period) => {
      const label = period.replace(/^(\d{4})-(\d{2})$/, (_, y, m) => {
        const months = ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"];
        return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
      });
      return {
        period: label,
        electricity: data.electricity.find((d) => d.period === period)?.value ?? null,
        gas: data.gas.find((d) => d.period === period)?.value ?? null,
        water: data.water.find((d) => d.period === period)?.value ?? null,
        telecom: data.telecom.find((d) => d.period === period)?.value ?? null,
        overall: data.overall.find((d) => d.period === period)?.value ?? null,
      };
    });

  const latestElec = data.electricity[data.electricity.length - 1];
  const latestGas = data.gas[data.gas.length - 1];
  const latestWater = data.water[data.water.length - 1];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-text">Инфлация по комунални услуги (Eurostat)</h3>
      </div>

      {/* Quick stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <MiniStat
          label="Ток"
          value={latestElec?.value}
          period={latestElec?.period}
        />
        <MiniStat
          label="Газ"
          value={latestGas?.value}
          period={latestGas?.period}
        />
        <MiniStat
          label="Вода"
          value={latestWater?.value}
          period={latestWater?.period}
        />
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
              formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
              contentStyle={{ fontSize: 12 }}
              itemStyle={{ padding: "2px 0" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="electricity"
              name="Ток"
              stroke="#eab308"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="gas"
              name="Газ"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="water"
              name="Вода"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="telecom"
              name="Телеком"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 4"
            />
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
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  period,
}: {
  label: string;
  value?: number;
  period?: string;
}) {
  if (value === undefined) return null;
  const isUp = value > 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  const color = isUp ? "text-red-600" : "text-green-600";

  return (
    <div className="rounded-lg border border-border bg-background p-2 text-center">
      <p className="text-xs text-muted">{label}</p>
      <div className={`flex items-center justify-center gap-1 ${color}`}>
        <Icon className="h-3.5 w-3.5" />
        <span className="text-lg font-bold">
          {value > 0 ? "+" : ""}
          {value.toFixed(1)}%
        </span>
      </div>
      {period && (
        <p className="text-[10px] text-muted">{period}</p>
      )}
    </div>
  );
}

// ---- EU Energy Price Comparison ----

export function EuPriceComparisonWidget() {
  const [data, setData] = useState<EnergyPriceComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnergyPriceComparison().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <WidgetSkeleton title="Цена на тока: България vs ЕС" />;
  if (!data || data.prices.length === 0) return null;

  const COLORS: Record<string, string> = {
    BG: "#059669",
    RO: "#3b82f6",
    DE: "#ef4444",
    EU27_2020: "#8b5cf6",
  };

  const chartData = data.prices.map((p) => ({
    name: p.label,
    "EUR/kWh": parseFloat(p.eurPerKwh.toFixed(4)),
    "ст./kWh": parseFloat((p.bgnPerKwh * 100).toFixed(2)),
    country: p.country,
  }));

  const bgPrice = data.prices.find((p) => p.country === "BG");
  const euPrice = data.prices.find((p) => p.country === "EU27_2020");
  const savings =
    bgPrice && euPrice
      ? ((1 - bgPrice.eurPerKwh / euPrice.eurPerKwh) * 100).toFixed(0)
      : null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-1 flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-text">
          Цена на тока: България vs ЕС ({data.period})
        </h3>
      </div>
      {savings && (
        <p className="mb-4 text-sm text-primary font-medium">
          Токът в България е с ~{savings}% по-евтин от средния за ЕС
        </p>
      )}

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
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
              width={85}
            />
            <Tooltip
              formatter={(value, name) => [
                name === "EUR/kWh"
                  ? `${Number(value).toFixed(4)} EUR/kWh`
                  : `${Number(value).toFixed(2)} ст./kWh`,
                name,
              ]}
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="EUR/kWh" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={COLORS[entry.country] || "#9ca3af"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted">
        Цени за домакинства вкл. данъци, EUR/kWh. Източник: Eurostat nrg_pc_204.
      </p>
    </div>
  );
}

// ---- Weather & Heating Widget ----

export function WeatherHeatingWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("sofia");

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWeather(city), fetchAirQuality(city)]).then(
      ([w, a]) => {
        setWeather(w);
        setAirQuality(a);
        setLoading(false);
      }
    );
  }, [city]);

  if (loading)
    return <WidgetSkeleton title="Време и прогноза за отопление" />;
  if (!weather) return null;

  const cities = [
    { id: "sofia", label: "София" },
    { id: "plovdiv", label: "Пловдив" },
    { id: "varna", label: "Варна" },
    { id: "burgas", label: "Бургас" },
  ];

  const heatingTip =
    weather.heatingDays >= 5
      ? "Очаква се студена седмица — по-висока сметка за отопление."
      : weather.heatingDays >= 3
        ? "Умерена нужда от отопление тази седмица."
        : "Топло е — ниски разходи за отопление.";

  const heatingColor =
    weather.heatingDays >= 5
      ? "text-red-600"
      : weather.heatingDays >= 3
        ? "text-yellow-600"
        : "text-green-600";

  const aqiColor =
    airQuality && airQuality.aqi > 75
      ? "text-red-600"
      : airQuality && airQuality.aqi > 50
        ? "text-yellow-600"
        : "text-green-600";

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text">Време и отопление</h3>
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-text"
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Current temp */}
        <div className="rounded-lg border border-border bg-background p-3 text-center">
          <Thermometer className="mx-auto mb-1 h-5 w-5 text-orange-500" />
          <p className="text-2xl font-bold text-text">
            {weather.currentTemp.toFixed(1)}°C
          </p>
          <p className="text-[10px] text-muted">
            Усеща се: {weather.feelsLike.toFixed(1)}°C
          </p>
        </div>

        {/* Heating forecast */}
        <div className="rounded-lg border border-border bg-background p-3 text-center">
          <div className={`mx-auto mb-1 text-sm font-bold ${heatingColor}`}>
            {weather.heatingDays}/7
          </div>
          <p className="text-xs font-medium text-text">Дни с отопление</p>
          <p className="text-[10px] text-muted">(средна &lt;15°C)</p>
        </div>

        {/* Wind */}
        <div className="rounded-lg border border-border bg-background p-3 text-center">
          <Wind className="mx-auto mb-1 h-5 w-5 text-blue-400" />
          <p className="text-lg font-bold text-text">
            {weather.windSpeed.toFixed(0)} km/h
          </p>
          <p className="text-[10px] text-muted">Вятър</p>
        </div>

        {/* Air quality */}
        {airQuality && (
          <div className="rounded-lg border border-border bg-background p-3 text-center">
            <Leaf className={`mx-auto mb-1 h-5 w-5 ${aqiColor}`} />
            <p className="text-lg font-bold text-text">AQI {airQuality.aqi}</p>
            <p className={`text-[10px] font-medium ${aqiColor}`}>
              {airQuality.label}
            </p>
          </div>
        )}
      </div>

      {/* Heating tip */}
      <div className={`mt-3 rounded-lg bg-background p-2 text-center text-sm ${heatingColor}`}>
        {heatingTip}
      </div>

      {/* 7-day forecast mini */}
      <div className="mt-3 flex justify-between gap-1">
        {weather.forecast.map((day, i) => {
          const dayName =
            i === 0
              ? "Днес"
              : new Date(day.date).toLocaleDateString("bg-BG", {
                  weekday: "short",
                });
          const avg = (day.min + day.max) / 2;
          const cold = avg < 15;
          return (
            <div
              key={day.date}
              className={`flex-1 rounded-lg p-1.5 text-center text-[10px] ${
                cold ? "bg-blue-50" : "bg-orange-50"
              }`}
            >
              <p className="font-medium text-muted">{dayName}</p>
              <p className="font-bold text-text">
                {day.max.toFixed(0)}°
              </p>
              <p className="text-muted">{day.min.toFixed(0)}°</p>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-muted">
        Източник: Open-Meteo API. Обновява се на всеки час.
      </p>
    </div>
  );
}

// ---- ECB Rate Widget ----

export function EcbRateWidget() {
  const [ecb, setEcb] = useState<EcbRate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEcbRate().then((d) => {
      setEcb(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <WidgetSkeleton title="ECB лихви за България" />;
  if (!ecb?.consumerRate) return null;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingDown className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-primary">
          Средна лихва по потребителски кредити в България
        </span>
      </div>
      <p className="text-sm text-text">
        <span className="text-2xl font-bold text-primary">
          {ecb.consumerRate.toFixed(2)}%
        </span>{" "}
        годишна лихва (период: {ecb.period})
        <span className="ml-2 text-xs text-muted">
          Източник: European Central Bank
        </span>
      </p>
    </div>
  );
}

// ---- Skeleton ----

function WidgetSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted" />
        <span className="text-sm text-muted">{title} — зареждане...</span>
      </div>
    </div>
  );
}
