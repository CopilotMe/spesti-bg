"use client";

import { useState, useMemo } from "react";
import {
  Zap,
  Flame,
  Droplets,
  Info,
  PieChart as PieChartIcon,
  Receipt,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { electricityProviders } from "@/data/electricity";
import { gasProviders } from "@/data/gas";
import { waterProviders } from "@/data/water";
import type { ElectricityProvider, GasProvider, WaterProvider } from "@/lib/types";

type UtilityType = "electricity" | "gas" | "water";

interface SliceData {
  name: string;
  rate: number;
  percentage: number;
  amount: number;
}

const PIE_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#f97316",
  "#ef4444",
  "#94a3b8",
];

const UTILITY_TABS: { type: UtilityType; label: string; icon: typeof Zap }[] = [
  { type: "electricity", label: "Ток", icon: Zap },
  { type: "gas", label: "Газ", icon: Flame },
  { type: "water", label: "Вода", icon: Droplets },
];

function getElectricitySlices(provider: ElectricityProvider): SliceData[] {
  const breakdownSum = provider.breakdown.reduce((s, c) => s + c.rate, 0);
  const vatRate = breakdownSum * 0.2;
  const totalWithVat = breakdownSum + vatRate;

  const slices: SliceData[] = provider.breakdown.map((c) => ({
    name: c.name,
    rate: c.rate,
    percentage: (c.rate / totalWithVat) * 100,
    amount: 0,
  }));

  slices.push({
    name: "ДДС (20%)",
    rate: vatRate,
    percentage: (vatRate / totalWithVat) * 100,
    amount: 0,
  });

  return slices;
}

function getGasSlices(provider: GasProvider): SliceData[] {
  const components = [
    { name: "Природен газ", rate: provider.pricePerM3 },
    { name: "Разпределение", rate: provider.distributionFee },
    { name: "Пренос", rate: provider.transmissionFee },
    { name: "Акциз", rate: provider.excise },
  ];
  const subtotal = components.reduce((s, c) => s + c.rate, 0);
  const vatRate = subtotal * 0.2;
  const total = subtotal + vatRate;

  const slices: SliceData[] = components.map((c) => ({
    name: c.name,
    rate: c.rate,
    percentage: (c.rate / total) * 100,
    amount: 0,
  }));

  slices.push({
    name: "ДДС (20%)",
    rate: vatRate,
    percentage: (vatRate / total) * 100,
    amount: 0,
  });

  return slices;
}

function getWaterSlices(provider: WaterProvider): SliceData[] {
  const supplyRate = provider.supplyRate;
  const sewerageRate = provider.sewerageRate;
  const treatmentRate = provider.treatmentRate;
  const subtotal = supplyRate + sewerageRate + treatmentRate;
  const vatAmount = provider.totalRateWithVat - subtotal;
  const total = provider.totalRateWithVat;

  return [
    {
      name: "Доставка",
      rate: supplyRate,
      percentage: (supplyRate / total) * 100,
      amount: 0,
    },
    {
      name: "Канализация",
      rate: sewerageRate,
      percentage: (sewerageRate / total) * 100,
      amount: 0,
    },
    {
      name: "Пречистване",
      rate: treatmentRate,
      percentage: (treatmentRate / total) * 100,
      amount: 0,
    },
    {
      name: "ДДС (20%)",
      rate: vatAmount,
      percentage: (vatAmount / total) * 100,
      amount: 0,
    },
  ];
}

function getEnergyPercentage(
  utilityType: UtilityType,
  provider: ElectricityProvider | GasProvider | WaterProvider
): number {
  if (utilityType === "electricity") {
    const p = provider as ElectricityProvider;
    const energyComponent = p.breakdown.find((c) => c.id === "energy");
    if (!energyComponent) return 0;
    const breakdownSum = p.breakdown.reduce((s, c) => s + c.rate, 0);
    return (energyComponent.rate / breakdownSum) * 100;
  }
  if (utilityType === "gas") {
    const p = provider as GasProvider;
    const total = p.pricePerM3 + p.distributionFee + p.transmissionFee + p.excise;
    return (p.pricePerM3 / total) * 100;
  }
  // water
  const p = provider as WaterProvider;
  return (p.supplyRate / p.totalRateWithVat) * 100;
}

function getCalloutLabel(utilityType: UtilityType): string {
  if (utilityType === "electricity") return "реална енергия";
  if (utilityType === "gas") return "реална енергия";
  return "реална вода";
}

function getUnitLabel(utilityType: UtilityType): string {
  if (utilityType === "electricity") return "\u20AC/kWh";
  return "\u20AC/m\u00B3";
}

export function BillBreakdownDashboard() {
  const [utilityType, setUtilityType] = useState<UtilityType>("electricity");
  const [selectedProvider, setSelectedProvider] = useState<string>("electrohold");
  const [monthlyBill, setMonthlyBill] = useState<number>(50);

  // Reset provider when utility type changes
  const handleUtilityChange = (type: UtilityType) => {
    setUtilityType(type);
    if (type === "electricity") setSelectedProvider("electrohold");
    else if (type === "gas") setSelectedProvider("overgas");
    else setSelectedProvider("sofiyska_voda");
  };

  const currentProvider = useMemo(() => {
    if (utilityType === "electricity") {
      return electricityProviders.find((p) => p.id === selectedProvider) ?? electricityProviders[0];
    }
    if (utilityType === "gas") {
      return gasProviders.find((p) => p.id === selectedProvider) ?? gasProviders[0];
    }
    return waterProviders.find((p) => p.id === selectedProvider) ?? waterProviders[0];
  }, [utilityType, selectedProvider]);

  const slices = useMemo(() => {
    let rawSlices: SliceData[];
    if (utilityType === "electricity") {
      rawSlices = getElectricitySlices(currentProvider as ElectricityProvider);
    } else if (utilityType === "gas") {
      rawSlices = getGasSlices(currentProvider as GasProvider);
    } else {
      rawSlices = getWaterSlices(currentProvider as WaterProvider);
    }

    const totalRate = rawSlices.reduce((s, sl) => s + sl.rate, 0);
    return rawSlices.map((sl) => ({
      ...sl,
      percentage: (sl.rate / totalRate) * 100,
      amount: (sl.rate / totalRate) * monthlyBill,
    }));
  }, [utilityType, currentProvider, monthlyBill]);

  const energyPct = useMemo(
    () => getEnergyPercentage(utilityType, currentProvider),
    [utilityType, currentProvider]
  );

  const providerOptions = useMemo(() => {
    if (utilityType === "electricity") {
      return electricityProviders.map((p) => ({ value: p.id, label: p.name }));
    }
    if (utilityType === "gas") {
      return gasProviders.map((p) => ({ value: p.id, label: p.name }));
    }
    return waterProviders.map((p) => ({ value: p.id, label: `${p.city} (${p.name})` }));
  }, [utilityType]);

  // Regional comparison data for electricity
  const regionalData = useMemo(() => {
    if (utilityType !== "electricity") return [];
    return electricityProviders.map((provider) => {
      const entry: Record<string, string | number> = { name: provider.name };
      for (const comp of provider.breakdown) {
        entry[comp.name] = comp.rate;
      }
      const breakdownSum = provider.breakdown.reduce((s, c) => s + c.rate, 0);
      entry["ДДС (20%)"] = breakdownSum * 0.2;
      return entry;
    });
  }, [utilityType]);

  const regionalBarKeys = useMemo(() => {
    if (utilityType !== "electricity") return [];
    const provider = electricityProviders[0];
    const keys = provider.breakdown.map((c) => c.name);
    keys.push("ДДС (20%)");
    return keys;
  }, [utilityType]);

  const unit = getUnitLabel(utilityType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Receipt className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-text">
          Разбивка на сметката
        </h2>
      </div>

      {/* Utility type tabs */}
      <div className="flex gap-2">
        {UTILITY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = utilityType === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => handleUtilityChange(tab.type)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-muted hover:text-text"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Provider/City selector + Monthly bill input */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            {utilityType === "water" ? "Град" : "Доставчик"}
          </label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {providerOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            {"Месечна сметка (\u20AC)"}
          </label>
          <input
            type="number"
            min={1}
            max={10000}
            value={monthlyBill}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val > 0) setMonthlyBill(val);
            }}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Callout card */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <PieChartIcon className="h-8 w-8 text-primary" />
          <div>
            <p className="text-2xl font-bold text-primary">
              {energyPct.toFixed(1)}%
            </p>
            <p className="text-sm text-muted">
              Само {energyPct.toFixed(1)}% от сметката ти е за {getCalloutLabel(utilityType)}
            </p>
          </div>
        </div>
      </div>

      {/* Donut chart */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-4 text-lg font-semibold text-text">
          Структура на сметката
        </h3>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={slices}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, value }) =>
                  `${name}: ${Number(value).toFixed(1)}%`
                }
              >
                {slices.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}%`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost breakdown table */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-4 text-lg font-semibold text-text">
          Разпределение на разходите за {monthlyBill.toFixed(2)} \u20AC
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="pb-2 pr-4 font-medium">Компонент</th>
                <th className="pb-2 pr-4 text-right font-medium">
                  Тарифа ({unit})
                </th>
                <th className="pb-2 pr-4 text-right font-medium">%</th>
                <th className="pb-2 text-right font-medium">
                  {"Сума (\u20AC)"}
                </th>
              </tr>
            </thead>
            <tbody>
              {slices.map((slice, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2 pr-4">
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-text">{slice.name}</span>
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-right text-text">
                    {slice.rate.toFixed(4)}
                  </td>
                  <td className="py-2 pr-4 text-right text-text">
                    {slice.percentage.toFixed(1)}%
                  </td>
                  <td className="py-2 text-right font-medium text-text">
                    {slice.amount.toFixed(2)} \u20AC
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border font-semibold">
                <td className="pt-2 pr-4 text-text">Общо</td>
                <td className="pt-2 pr-4 text-right text-text">
                  {slices.reduce((s, sl) => s + sl.rate, 0).toFixed(4)}
                </td>
                <td className="pt-2 pr-4 text-right text-text">100.0%</td>
                <td className="pt-2 text-right text-text">
                  {monthlyBill.toFixed(2)} \u20AC
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Regional comparison (electricity only) */}
      {utilityType === "electricity" && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-4 text-lg font-semibold text-text">
            Сравнение по региони
          </h3>
          <p className="mb-4 text-sm text-muted">
            Разбивка на тарифата за трите електроразпределителни дружества
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={regionalData}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e7eb)" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--color-muted, #6b7280)" }}
                tickFormatter={(v: number) => v.toFixed(3)}
                unit=" \u20AC/kWh"
              />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={{ fontSize: 11, fill: "var(--color-text, #1f2937)" }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toFixed(4)} \u20AC/kWh`,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {regionalBarKeys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Methodology note */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted">
            <p className="mb-1 font-semibold text-text">Методология</p>
            <p>
              Данните за тарифите са от решенията на КЕВР за регулаторния период
              юли 2025 &ndash; юни 2026. Всички цени са конвертирани в евро по
              фиксирания курс 1 EUR = 1.95583 BGN. Разпределението на сметката е
              пропорционално &mdash; всеки компонент получава дял, равен на
              процента му от общата тарифа (с ДДС). Реалното разпределение може
              леко да варира при двутарифен електромер или при различна
              структура на потреблението.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
