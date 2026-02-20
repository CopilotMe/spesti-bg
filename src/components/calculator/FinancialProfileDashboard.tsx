"use client";

import { useState, useMemo, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  User,
  Home,
  Zap,
  Droplets,
  Flame,
  Car,
  Wifi,
  Smartphone,
  ShoppingCart,
  Shield,
  Clock,
  TrendingDown,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  MapPin,
  BarChart3,
  Pencil,
  CheckCircle2,
} from "lucide-react";
import { electricityProviders } from "@/data/electricity";
import { waterProviders } from "@/data/water";
import { gasProviders } from "@/data/gas";
import { mobilePlans, internetPlans } from "@/data/telecom";
import { insuranceProducts } from "@/data/insurance";
import { basketProducts, minimumWageEur } from "@/data/basket";

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "spesti_financial_profile_v2";

const NATIONAL_AVERAGES = {
  electricity: 43, // EUR/month (Eurostat/NSI 2024)
  water: 11,
  gas: 23,
  internet: 13,
  mobile: 15,
  fuel: 102,
  food: 256,
  insurance: 20,
  total: 620, // roughly aligned with median net salary
};

const CATEGORY_COLORS = [
  "#10b981", // electricity — emerald
  "#3b82f6", // water — blue
  "#f59e0b", // gas — amber
  "#6366f1", // internet — indigo
  "#ec4899", // mobile — pink
  "#ef4444", // fuel — red
  "#84cc16", // food — lime
  "#8b5cf6", // insurance — violet
];

const CATEGORY_LABELS: Record<string, string> = {
  electricity: "Ток",
  water: "Вода",
  gas: "Газ",
  internet: "Интернет",
  mobile: "Мобилен",
  fuel: "Гориво",
  food: "Храна",
  insurance: "Застраховки",
};

// Heating type to multiplier for electricity use
const HEATING_ELECTRICITY_FACTOR: Record<string, number> = {
  electric: 1.8,   // electric heating — high usage
  gas: 1.0,        // gas heating — normal electricity use
  district: 1.0,   // district heating — normal electricity use
  heatpump: 1.3,   // heat pump — moderate extra
};

// ─── Types ────────────────────────────────────────────────────────────────────

type CostKey = "electricity" | "water" | "gas" | "internet" | "mobile" | "fuel" | "food" | "insurance";

interface UserProfile {
  // Location
  electricityProvider: string;
  waterCity: string;
  hasGas: boolean;
  gasProvider: string;
  // Household
  apartmentM2: number;
  residents: number;
  heatingType: "electric" | "gas" | "district" | "heatpump";
  // Transport
  hasCar: boolean;
  fuelType: "gasoline" | "diesel" | "lpg" | "electric";
  kmPerMonth: number;
  // Connectivity
  internetPlan: string;
  mobilePlans: number; // how many mobile plans
  // Insurance
  hasGO: boolean;
  hasKasko: boolean;
  // Finance
  netSalary: number;
  // Manual overrides (optional real bill amounts)
  manualOverrides: Partial<Record<CostKey, number>>;
}

interface CostBreakdown {
  electricity: number;
  water: number;
  gas: number;
  internet: number;
  mobile: number;
  fuel: number;
  food: number;
  insurance: number;
}

// ─── Default profile ──────────────────────────────────────────────────────────

const defaultProfile: UserProfile = {
  electricityProvider: "electrohold",
  waterCity: "sofiyska_voda",
  hasGas: false,
  gasProvider: "overgas",
  apartmentM2: 65,
  residents: 2,
  heatingType: "electric",
  hasCar: true,
  fuelType: "gasoline",
  kmPerMonth: 800,
  internetPlan: "",
  mobilePlans: 2,
  hasGO: true,
  hasKasko: false,
  netSalary: 900,
  manualOverrides: {},
};

// ─── Calculation helpers ──────────────────────────────────────────────────────

function estimateElectricity(profile: UserProfile): number {
  // Base: ~3 kWh/m2/month for normal use
  const baseKwh = profile.apartmentM2 * 3;
  // Heating factor
  const heatFactor = HEATING_ELECTRICITY_FACTOR[profile.heatingType] ?? 1;
  // Resident factor
  const residentFactor = 0.8 + profile.residents * 0.2;
  const totalKwh = baseKwh * heatFactor * residentFactor;
  const provider = electricityProviders.find(
    (p) => p.id === profile.electricityProvider,
  );
  const rate = provider?.singleRate ?? 0.136;
  return Math.round(totalKwh * rate * 100) / 100;
}

function estimateWater(profile: UserProfile): number {
  // ~4 m3/person/month
  const m3 = profile.residents * 4;
  const provider = waterProviders.find((p) => p.id === profile.waterCity);
  const rate = provider?.totalRateWithVat ?? 2.64;
  return Math.round(m3 * rate * 100) / 100;
}

function estimateGas(profile: UserProfile): number {
  if (!profile.hasGas || profile.heatingType !== "gas") return 0;
  // Estimate: ~8 m3/m2/year for heating, avg 5 months/year
  const annualM3 = profile.apartmentM2 * 8;
  const monthlyM3 = annualM3 / 12;
  const provider = gasProviders.find((p) => p.id === profile.gasProvider);
  const totalRate = provider
    ? provider.pricePerM3 +
      provider.distributionFee +
      provider.transmissionFee +
      provider.excise
    : 0.62;
  return Math.round(monthlyM3 * totalRate * 1.2 * 100) / 100; // 1.2 = VAT
}

function estimateFuel(profile: UserProfile): number {
  if (!profile.hasCar) return 0;
  const consumptionPer100km: Record<string, number> = {
    gasoline: 7.5,
    diesel: 6.0,
    lpg: 10.0,
    electric: 0, // separate calculation
  };
  const fuelPricePerL: Record<string, number> = {
    gasoline: 1.25,
    diesel: 1.28,
    lpg: 0.57,
    electric: 0,
  };
  if (profile.fuelType === "electric") {
    // ~18 kWh/100km, charged at home
    const provider = electricityProviders.find(
      (p) => p.id === profile.electricityProvider,
    );
    const rate = provider?.nightRate ?? 0.072;
    return Math.round((profile.kmPerMonth / 100) * 18 * rate * 100) / 100;
  }
  const liters =
    (profile.kmPerMonth / 100) * consumptionPer100km[profile.fuelType];
  return Math.round(liters * fuelPricePerL[profile.fuelType] * 100) / 100;
}

function estimateInternet(profile: UserProfile): number {
  if (!profile.internetPlan) return 20; // default average
  const plan = internetPlans.find((p) => p.id === profile.internetPlan);
  return plan?.monthlyFee ?? 20;
}

function estimateMobile(profile: UserProfile): number {
  // Average mobile plan in Bulgaria ~15 EUR
  return profile.mobilePlans * 15;
}

function estimateInsurance(profile: UserProfile): number {
  let total = 0;
  if (profile.hasCar && profile.hasGO) {
    // Cheapest GO average
    const goProducts = insuranceProducts.filter((p) => p.type === "go");
    const avgGo =
      goProducts.reduce((s, p) => s + p.monthlyPremium, 0) / goProducts.length;
    total += avgGo;
  }
  if (profile.hasCar && profile.hasKasko) {
    const kaskoProducts = insuranceProducts.filter((p) => p.type === "kasko");
    const avgKasko =
      kaskoProducts.reduce((s, p) => s + p.monthlyPremium, 0) /
      kaskoProducts.length;
    total += avgKasko;
  }
  return Math.round(total * 100) / 100;
}

function estimateFood(profile: UserProfile): number {
  // Consumer basket total (57 EUR for 21 essential products)
  // Scale by residents (not linear — shared items)
  const basketTotal = basketProducts.reduce((s, p) => s + p.priceEur, 0);
  // Monthly food estimate: basket * 4 weeks * residents factor
  const residentFactor = 1 + (profile.residents - 1) * 0.7;
  return Math.round(basketTotal * 4 * residentFactor * 100) / 100;
}

function calculateProfile(profile: UserProfile): CostBreakdown {
  const o = profile.manualOverrides ?? {};
  return {
    electricity: o.electricity != null ? o.electricity : estimateElectricity(profile),
    water: o.water != null ? o.water : estimateWater(profile),
    gas: o.gas != null ? o.gas : estimateGas(profile),
    internet: o.internet != null ? o.internet : estimateInternet(profile),
    mobile: o.mobile != null ? o.mobile : estimateMobile(profile),
    fuel: o.fuel != null ? o.fuel : estimateFuel(profile),
    food: o.food != null ? o.food : estimateFood(profile),
    insurance: o.insurance != null ? o.insurance : estimateInsurance(profile),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
      <span className="text-primary">{icon}</span>
      <h2 className="font-semibold text-text">{title}</h2>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color = "text-text",
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      {icon && <div className="mb-2 text-primary">{icon}</div>}
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="mt-0.5 text-sm font-medium text-text">{label}</div>
      {sub && <div className="mt-1 text-xs text-muted">{sub}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FinancialProfileDashboard() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [showForm, setShowForm] = useState(true);
  const [hasResult, setHasResult] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserProfile;
        setProfile(parsed);
        setHasResult(true);
        setShowForm(false);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage whenever profile changes
  useEffect(() => {
    if (hasResult) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, hasResult]);

  const costs = useMemo(() => calculateProfile(profile), [profile]);

  const totalMonthly = useMemo(
    () =>
      Math.round(
        Object.values(costs).reduce((s, v) => s + v, 0) * 100,
      ) / 100,
    [costs],
  );

  const totalNational = useMemo(
    () =>
      Object.values(NATIONAL_AVERAGES)
        .slice(0, -1)
        .reduce((s, v) => s + v, 0),
    [],
  );

  // % of salary consumed
  const salaryPercent = useMemo(
    () =>
      profile.netSalary > 0
        ? Math.round((totalMonthly / profile.netSalary) * 100)
        : 0,
    [totalMonthly, profile.netSalary],
  );

  // Work days to pay total bills (based on 21 working days/month)
  const workDays = useMemo(
    () =>
      profile.netSalary > 0
        ? Math.round((totalMonthly / profile.netSalary) * 21 * 10) / 10
        : 0,
    [totalMonthly, profile.netSalary],
  );

  // Work days per category
  const workDaysByCategory = useMemo(() => {
    const dailySalary = profile.netSalary / 21;
    return Object.entries(costs).map(([key, value]) => ({
      name: CATEGORY_LABELS[key] ?? key,
      days: dailySalary > 0 ? Math.round((value / dailySalary) * 10) / 10 : 0,
      eur: value,
    }));
  }, [costs, profile.netSalary]);

  // Pie chart data
  const pieData = useMemo(
    () =>
      Object.entries(costs)
        .filter(([, v]) => v > 0)
        .map(([key, value], i) => ({
          name: CATEGORY_LABELS[key] ?? key,
          value: Math.round(value * 100) / 100,
          color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        })),
    [costs],
  );

  // Comparison vs national average
  const comparisonData = useMemo(
    () =>
      Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
        name: label,
        ти: Math.round((costs[key as keyof CostBreakdown] ?? 0) * 100) / 100,
        средно:
          NATIONAL_AVERAGES[key as keyof typeof NATIONAL_AVERAGES] ?? 0,
      })),
    [costs],
  );

  // Personal inflation vs national: rough proxy
  // If electricity cost > national avg → higher personal inflation
  const personalInflation = useMemo(() => {
    const elecRatio = costs.electricity / NATIONAL_AVERAGES.electricity;
    const fuelRatio = costs.fuel > 0 ? costs.fuel / NATIONAL_AVERAGES.fuel : 1;
    const foodRatio = costs.food / NATIONAL_AVERAGES.food;
    const avgRatio = (elecRatio + fuelRatio + foodRatio) / 3;
    const nationalInflation = 3.5; // approximate BG CPI 2025
    return Math.round(nationalInflation * avgRatio * 10) / 10;
  }, [costs]);

  // Optimization tips
  const tips = useMemo(() => {
    const result: { icon: React.ReactNode; text: string; saving: number }[] =
      [];

    if (profile.heatingType === "electric" && costs.electricity > 80) {
      result.push({
        icon: <Zap className="h-4 w-4" />,
        text: "Преминаването към нощна тарифа за отопление може да намали сметката ти за ток с ~30%",
        saving: Math.round(costs.electricity * 0.3),
      });
    }

    if (profile.hasCar && profile.fuelType === "gasoline" && costs.fuel > 60) {
      result.push({
        icon: <Car className="h-4 w-4" />,
        text: "Преминаването на LPG при ~800 km/месец може да спести до 40% от горивото",
        saving: Math.round(costs.fuel * 0.35),
      });
    }

    if (profile.hasKasko) {
      const goProducts = insuranceProducts.filter((p) => p.type === "kasko");
      const minKasko = Math.min(...goProducts.map((p) => p.monthlyPremium));
      const maxKasko = Math.max(...goProducts.map((p) => p.monthlyPremium));
      const diff = Math.round(maxKasko - minKasko);
      if (diff > 5) {
        result.push({
          icon: <Shield className="h-4 w-4" />,
          text: `Сравни КАСКО офертите — разликата между доставчиците е до ${diff} EUR/месец`,
          saving: diff,
        });
      }
    }

    if (costs.internet > 25) {
      result.push({
        icon: <Wifi className="h-4 w-4" />,
        text: "Има интернет планове от 14.99 EUR/месец с 500 Mbps — провери дали плащаш прекалено много",
        saving: Math.round(costs.internet - 15),
      });
    }

    const waterProvider = waterProviders.find(
      (p) => p.id === profile.waterCity,
    );
    const cheapestWater = waterProviders.reduce((min, p) =>
      p.totalRateWithVat < min.totalRateWithVat ? p : min,
    );
    if (
      waterProvider &&
      waterProvider.totalRateWithVat > cheapestWater.totalRateWithVat + 0.5
    ) {
      const saving = Math.round(
        (waterProvider.totalRateWithVat - cheapestWater.totalRateWithVat) *
          profile.residents *
          4 *
          100,
      ) / 100;
      result.push({
        icon: <Droplets className="h-4 w-4" />,
        text: `В ${cheapestWater.city} водата е ${(cheapestWater.totalRateWithVat).toFixed(2)} EUR/m³ срещу ${waterProvider.totalRateWithVat.toFixed(2)} EUR/m³ при теб`,
        saving,
      });
    }

    return result.slice(0, 4);
  }, [profile, costs]);

  function handleCompute() {
    setHasResult(true);
    setShowForm(false);
  }

  function upd<K extends keyof UserProfile>(key: K, val: UserProfile[K]) {
    setProfile((p) => ({ ...p, [key]: val }));
  }

  function setOverride(key: CostKey, val: string) {
    const num = val === "" ? undefined : parseFloat(val);
    setProfile((p) => ({
      ...p,
      manualOverrides: {
        ...(p.manualOverrides ?? {}),
        [key]: isNaN(num as number) ? undefined : num,
      },
    }));
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Input form ── */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <button
          className="flex w-full items-center justify-between"
          onClick={() => setShowForm((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="font-semibold text-text">
              {hasResult ? "Редактирай профила си" : "Въведи данните за домакинството си"}
            </span>
          </div>
          {showForm ? (
            <ChevronUp className="h-4 w-4 text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted" />
          )}
        </button>

        {showForm && (
          <div className="mt-5 space-y-6">
            {/* Location & Utilities */}
            <div>
              <SectionHeader
                icon={<MapPin className="h-4 w-4" />}
                title="Местоположение и комунални"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">
                    Електроразпределение
                  </label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                    value={profile.electricityProvider}
                    onChange={(e) => upd("electricityProvider", e.target.value)}
                  >
                    {electricityProviders.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.region})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">
                    Град (вода)
                  </label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                    value={profile.waterCity}
                    onChange={(e) => upd("waterCity", e.target.value)}
                  >
                    {waterProviders.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">
                    Отопление
                  </label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                    value={profile.heatingType}
                    onChange={(e) =>
                      upd(
                        "heatingType",
                        e.target.value as UserProfile["heatingType"],
                      )
                    }
                  >
                    <option value="electric">Ток (конвектор/климатик)</option>
                    <option value="gas">Природен газ</option>
                    <option value="district">Централна топлофикация</option>
                    <option value="heatpump">Термопомпа</option>
                  </select>
                </div>
                {profile.heatingType === "gas" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text">
                      Газоразпределение
                    </label>
                    <select
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                      value={profile.gasProvider}
                      onChange={(e) => upd("gasProvider", e.target.value)}
                    >
                      {gasProviders.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Household */}
            <div>
              <SectionHeader
                icon={<Home className="h-4 w-4" />}
                title="Домакинство"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">
                    Площ на жилището (m²)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={300}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                    value={profile.apartmentM2}
                    onChange={(e) =>
                      upd("apartmentM2", Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">
                    Брой живущи
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                    value={profile.residents}
                    onChange={(e) => upd("residents", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">
                    Нетна заплата (EUR/месец)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                    value={profile.netSalary}
                    onChange={(e) => upd("netSalary", Number(e.target.value))}
                  />
                  <p className="mt-1 text-xs text-muted">
                    Минимална заплата: {minimumWageEur} EUR
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">
                    Интернет план
                  </label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                    value={profile.internetPlan}
                    onChange={(e) => upd("internetPlan", e.target.value)}
                  >
                    <option value="">Средна цена (~20 EUR)</option>
                    {internetPlans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.providerName} — {p.planName} ({p.speedMbps} Mbps,{" "}
                        {p.monthlyFee} EUR)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">
                    Брой мобилни абонаменти
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                    value={profile.mobilePlans}
                    onChange={(e) => upd("mobilePlans", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Transport */}
            <div>
              <SectionHeader
                icon={<Car className="h-4 w-4" />}
                title="Транспорт"
              />
              <div className="mb-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasCar"
                  checked={profile.hasCar}
                  onChange={(e) => upd("hasCar", e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <label htmlFor="hasCar" className="text-sm font-medium text-text">
                  Имам автомобил
                </label>
              </div>
              {profile.hasCar && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text">
                      Вид гориво
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ["gasoline", "Бензин"],
                          ["diesel", "Дизел"],
                          ["lpg", "LPG"],
                          ["electric", "Електро"],
                        ] as const
                      ).map(([val, label]) => (
                        <button
                          key={val}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            profile.fuelType === val
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted hover:border-primary/50"
                          }`}
                          onClick={() => upd("fuelType", val)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text">
                      Изминати км/месец
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
                      value={profile.kmPerMonth}
                      onChange={(e) =>
                        upd("kmPerMonth", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">
                      Застраховки
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="hasGO"
                        checked={profile.hasGO}
                        onChange={(e) => upd("hasGO", e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                      <label htmlFor="hasGO" className="text-sm text-text">
                        Гражданска отговорност (ГО)
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="hasKasko"
                        checked={profile.hasKasko}
                        onChange={(e) => upd("hasKasko", e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                      <label htmlFor="hasKasko" className="text-sm text-text">
                        КАСКО
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Optional: real bill overrides */}
            <div>
              <SectionHeader
                icon={<Pencil className="h-4 w-4" />}
                title="Реални сметки (незадължително)"
              />
              <p className="mb-4 text-sm text-muted">
                Имаш реална сметка? Въведи я и ще заменим автоматичната оценка с точната стойност.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    ["electricity", "⚡ Ток (EUR/мес)"],
                    ["water", "💧 Вода (EUR/мес)"],
                    ["gas", "🔥 Газ (EUR/мес)"],
                    ["fuel", "⛽ Гориво (EUR/мес)"],
                    ["internet", "📡 Интернет (EUR/мес)"],
                    ["mobile", "📱 Мобилен (EUR/мес)"],
                    ["food", "🛒 Храна (EUR/мес)"],
                    ["insurance", "🛡 Застраховки (EUR/мес)"],
                  ] as [CostKey, string][]
                ).map(([key, label]) => {
                  const overrideVal = profile.manualOverrides?.[key];
                  const hasOverride = overrideVal != null;
                  return (
                    <div key={key} className="relative">
                      <label className="mb-1 block text-xs font-medium text-text">
                        {label}
                        {hasOverride && (
                          <CheckCircle2 className="ml-1 inline h-3 w-3 text-emerald-500" />
                        )}
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        placeholder="авт."
                        className={`w-full rounded-lg border px-3 py-2 text-sm ${
                          hasOverride
                            ? "border-emerald-400 bg-emerald-50 text-text dark:bg-emerald-900/20"
                            : "border-border bg-background text-text"
                        }`}
                        value={overrideVal ?? ""}
                        onChange={(e) => setOverride(key, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
              {Object.keys(profile.manualOverrides ?? {}).length > 0 && (
                <button
                  className="mt-2 text-xs text-muted underline hover:text-text"
                  onClick={() => upd("manualOverrides", {})}
                >
                  Изчисти всички ръчни стойности
                </button>
              )}
            </div>

            <button
              onClick={handleCompute}
              className="w-full rounded-full bg-primary-dark py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary"
            >
              Изчисли моя финансов профил →
            </button>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {hasResult && (
        <>
          {/* Hero summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<BarChart3 className="h-5 w-5" />}
              label="Общо месечни разходи"
              value={`${totalMonthly.toFixed(0)} EUR`}
              sub={`Средно за България: ~${totalNational} EUR`}
              color={
                totalMonthly > totalNational * 1.15
                  ? "text-red-500"
                  : totalMonthly < totalNational * 0.85
                    ? "text-emerald-600"
                    : "text-text"
              }
            />
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              label="Работни дни за сметки"
              value={`${workDays} дни`}
              sub={`от ${profile.netSalary > 0 ? 21 : "–"} работни дни/месец`}
              color={workDays > 10 ? "text-amber-600" : "text-text"}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Лична инфлация"
              value={`~${personalInflation}%`}
              sub="Национална: ~3.5% (2025)"
              color={
                personalInflation > 4.5
                  ? "text-red-500"
                  : "text-text"
              }
            />
            <StatCard
              icon={
                salaryPercent > 60 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )
              }
              label="% от заплатата"
              value={`${salaryPercent}%`}
              sub="за разходи на домакинството"
              color={
                salaryPercent > 70
                  ? "text-red-500"
                  : salaryPercent > 55
                    ? "text-amber-600"
                    : "text-emerald-600"
              }
            />
          </div>

          {/* "Time cost" callout */}
          {profile.netSalary > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-200">
                    Времева цена на разходите ти
                  </p>
                  <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                    При нетна заплата от {profile.netSalary} EUR/месец, дневната
                    ти стойност на труда е{" "}
                    <strong>
                      {(profile.netSalary / 21).toFixed(0)} EUR/ден
                    </strong>
                    . За да платиш всички месечни разходи ({totalMonthly.toFixed(0)} EUR),
                    работиш <strong>{workDays} работни дни</strong> — или{" "}
                    <strong>
                      {Math.round((workDays / 21) * 100)}% от работния си месец
                    </strong>
                    .
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {workDaysByCategory
                      .filter((c) => c.days > 0)
                      .sort((a, b) => b.days - a.days)
                      .slice(0, 4)
                      .map((c) => (
                        <div
                          key={c.name}
                          className="rounded-lg bg-amber-100 px-3 py-2 text-center dark:bg-amber-900/30"
                        >
                          <div className="text-lg font-bold text-amber-900 dark:text-amber-200">
                            {c.days}д
                          </div>
                          <div className="text-xs text-amber-700 dark:text-amber-400">
                            {c.name}
                          </div>
                          <div className="text-xs text-amber-600 dark:text-amber-500">
                            {c.eur.toFixed(0)} EUR
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pie + breakdown table side by side */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pie chart */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-4 font-semibold text-text">
                Разпределение на разходите
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(2)} EUR`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown table */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-4 font-semibold text-text">
                Детайлна разбивка
              </h2>
              <div className="space-y-2">
                {Object.entries(costs)
                  .filter(([, v]) => v > 0)
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, value], i) => {
                    const label =
                      CATEGORY_LABELS[key] ?? key;
                    const nationalAvg =
                      NATIONAL_AVERAGES[
                        key as keyof typeof NATIONAL_AVERAGES
                      ] ?? 0;
                    const diff =
                      nationalAvg > 0
                        ? Math.round(
                            ((value - nationalAvg) / nationalAvg) * 100,
                          )
                        : null;
                    const color =
                      CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-background"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm text-text">{label}</span>
                          {diff !== null && (
                            <span
                              className={`text-xs ${diff > 15 ? "text-red-500" : diff < -15 ? "text-emerald-600" : "text-muted"}`}
                            >
                              {diff > 0 ? `+${diff}%` : `${diff}%`} vs средно
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-text">
                            {value.toFixed(2)} EUR
                          </span>
                          <span className="ml-1 text-xs text-muted">
                            / мес
                          </span>
                        </div>
                      </div>
                    );
                  })}
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                  <span className="font-semibold text-text">Общо</span>
                  <span className="text-lg font-bold text-text">
                    {totalMonthly.toFixed(2)} EUR
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Годишно</span>
                  <span>{(totalMonthly * 12).toFixed(0)} EUR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison vs national average */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-1 font-semibold text-text">
              Ти vs. средно за България
            </h2>
            <p className="mb-4 text-sm text-muted">
              Сравнение на месечните разходи по категория (EUR)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={comparisonData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} unit=" €" />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(2)} EUR`,
                    name === "ти" ? "Твоят разход" : "Средно за БГ",
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === "ти" ? "Твоят разход" : "Средно за БГ"
                  }
                />
                <ReferenceLine y={0} stroke="#888" />
                <Bar dataKey="ти" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="средно" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Personal inflation callout */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-text">
                  Твоята лична инфлация:{" "}
                  <span
                    className={
                      personalInflation > 4.5
                        ? "text-red-500"
                        : "text-primary"
                    }
                  >
                    ~{personalInflation}%
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  Националната инфлация е ~3.5% (2025), но твоята лична инфлация
                  може да е различна в зависимост от структурата на разходите ти.
                  {profile.heatingType === "electric" &&
                    " Тъй като се отопляваш с ток, промените в тарифите на електроенергията те засягат по-силно от средния потребител."}
                  {profile.hasCar &&
                    profile.fuelType === "gasoline" &&
                    " Горивото е значителен разход в профила ти — волатилността на петрола директно влияе на твоята инфлация."}
                </p>
              </div>
            </div>
          </div>

          {/* Optimization tips */}
          {tips.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h2 className="font-semibold text-text">
                  Персонализирани препоръки за спестяване
                </h2>
              </div>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-border p-3"
                  >
                    <span className="mt-0.5 shrink-0 text-primary">
                      {tip.icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-text">{tip.text}</p>
                    </div>
                    <div className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      до {tip.saving} EUR/мес
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted">
                Общ потенциал за спестяване:{" "}
                <strong>
                  до{" "}
                  {tips
                    .reduce((s, t) => s + t.saving, 0)}{" "}
                  EUR/месец
                </strong>{" "}
                ({(tips.reduce((s, t) => s + t.saving, 0) * 12).toFixed(0)}{" "}
                EUR/година)
              </p>
            </div>
          )}

          {/* Methodology */}
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-start gap-2 text-xs text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <strong>Методология:</strong> Разходите са прогнозни стойности
                базирани на официалните тарифи на КЕВР, данни от ВиК операторите
                и КНСБ. Потреблението на ток е изчислено по ~3 kWh/m²/месец с
                корекция за вида отопление. Водата — 4 m³/живущ/месец.
                Националните средни стойности са от Eurostat/НСИ 2024.
                Профилът се пази само в браузъра ти (localStorage). 1 EUR =
                1.95583 BGN.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
