"use client";

import { useState, useEffect } from "react";
import { Wind, Loader2, MapPin, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { fetchAirQuality, type AirQuality } from "@/lib/api";

const CITIES = [
  { key: "sofia", label: "София" },
  { key: "plovdiv", label: "Пловдив" },
  { key: "varna", label: "Варна" },
  { key: "burgas", label: "Бургас" },
];

function getAqiColor(aqi: number): string {
  if (aqi <= 25) return "text-green-600";
  if (aqi <= 50) return "text-yellow-500";
  if (aqi <= 75) return "text-orange-500";
  if (aqi <= 100) return "text-red-500";
  return "text-red-700";
}

function getAqiBg(aqi: number): string {
  if (aqi <= 25) return "bg-green-50 border-green-200";
  if (aqi <= 50) return "bg-yellow-50 border-yellow-200";
  if (aqi <= 75) return "bg-orange-50 border-orange-200";
  if (aqi <= 100) return "bg-red-50 border-red-200";
  return "bg-red-100 border-red-300";
}

function getAqiIcon(aqi: number) {
  if (aqi <= 50) return <CheckCircle className="h-5 w-5 text-green-600" />;
  return <AlertTriangle className="h-5 w-5 text-orange-500" />;
}

function getHealthAdvice(aqi: number): string {
  if (aqi <= 25) return "Няма ограничения. Идеално за навън.";
  if (aqi <= 50) return "Подходящо за навън. Чувствителните групи да ограничат продължително натоварване.";
  if (aqi <= 75) return "Чувствителните групи (астма, сърдечни проблеми) да ограничат дейности на открито.";
  if (aqi <= 100) return "Избягвайте продължителни натоварвания навън. Проветрявайте кратко.";
  return "Стойте на закрито. Затворете прозорците. Използвайте пречиствател на въздух.";
}

function PmBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color =
    pct < 40 ? "bg-green-500" : pct < 70 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-text">{value.toFixed(1)} µg/m³</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-200">
        <div
          className={`h-2.5 rounded-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AirQualityDashboard() {
  const [data, setData] = useState<Record<string, AirQuality | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(CITIES.map((c) => fetchAirQuality(c.key))).then((results) => {
      const map: Record<string, AirQuality | null> = {};
      CITIES.forEach((c, i) => {
        map[c.key] = results[i];
      });
      setData(map);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-muted">Зареждане на данни за качеството на въздуха...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* City cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {CITIES.map((city) => {
          const aq = data[city.key];
          if (!aq) return null;

          return (
            <div
              key={city.key}
              className={`rounded-xl border p-5 ${getAqiBg(aq.aqi)}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted" />
                  <span className="font-semibold text-text">{city.label}</span>
                </div>
                {getAqiIcon(aq.aqi)}
              </div>

              {/* AQI badge */}
              <div className="mb-4 flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${getAqiColor(aq.aqi)}`}>
                  {aq.aqi}
                </span>
                <span className="text-sm text-muted">AQI</span>
                <span
                  className={`ml-auto rounded-full px-3 py-0.5 text-xs font-medium ${getAqiColor(aq.aqi)} bg-white/60`}
                >
                  {aq.label}
                </span>
              </div>

              {/* PM bars */}
              <div className="space-y-3">
                <PmBar label="PM10" value={aq.pm10} max={100} />
                <PmBar label="PM2.5" value={aq.pm25} max={50} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Health advice based on worst city */}
      {(() => {
        const worstAqi = Math.max(
          ...Object.values(data)
            .filter(Boolean)
            .map((d) => d!.aqi),
        );
        return (
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start gap-3">
              <Wind className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h2 className="mb-1 font-semibold text-text">
                  Здравни препоръки
                </h2>
                <p className="text-sm text-muted">
                  {getHealthAdvice(worstAqi)}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Scale explanation */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="mb-2 font-semibold text-text">
              Европейски индекс за качество на въздуха (EAQI)
            </h2>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {[
                { range: "0–25", label: "Добро", color: "bg-green-100 text-green-700" },
                { range: "25–50", label: "Задоволително", color: "bg-yellow-100 text-yellow-700" },
                { range: "50–75", label: "Умерено", color: "bg-orange-100 text-orange-700" },
                { range: "75–100", label: "Лошо", color: "bg-red-100 text-red-700" },
                { range: ">100", label: "Много лошо", color: "bg-red-200 text-red-800" },
              ].map((s) => (
                <div key={s.range} className={`rounded-lg p-2 ${s.color}`}>
                  <div className="font-semibold">{s.range}</div>
                  <div>{s.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">
              PM10 — фини прахови частици до 10 µm. Норма на ЕС: 50 µg/m³
              средноденонощно. PM2.5 — ултрафини частици до 2.5 µm, по-опасни за
              здравето. Норма на ЕС: 25 µg/m³ годишна средна стойност.
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        Данни от Open-Meteo Air Quality API. Обновяване на всеки час.
      </p>
    </div>
  );
}
