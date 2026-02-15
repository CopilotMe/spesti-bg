"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wallet,
  Zap,
  Droplets,
  Flame,
  Wifi,
  Fuel,
  Landmark,
  ShieldCheck,
  ShoppingCart,
  Heart,
  GraduationCap,
  Bus,
  Tv,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateElectricityBills } from "@/lib/calculators/electricity";
import { calculateWaterBills } from "@/lib/calculators/water";
import { calculateGasBills } from "@/lib/calculators/gas";
import { calculateFuelCosts } from "@/lib/calculators/fuel";
import { calculateLoans } from "@/lib/calculators/loans";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface BudgetCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  amount: number;
  calculatorLink?: string;
  calculatorLabel?: string;
  savingTip?: string;
}

const COLORS = [
  "#059669", "#3b82f6", "#f97316", "#eab308", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f43f5e", "#6366f1",
  "#14b8a6", "#a855f7",
];

// Average Bulgarian household monthly data (Eurostat / NSI 2024)
const BG_AVERAGE = {
  income: 2200,
  electricity: 85,
  water: 22,
  gas: 45,
  internet: 25,
  fuel: 200,
  loan: 0,
  insurance: 40,
  food: 500,
  health: 80,
  education: 50,
  transport: 100,
  entertainment: 60,
  other: 150,
};

export function BudgetCalculator() {
  // Income
  const [income, setIncome] = useState(3000);

  // Utility categories (linked to our calculators)
  const [electricityKwh, setElectricityKwh] = useState(200);
  const [waterM3, setWaterM3] = useState(5);
  const [gasM3, setGasM3] = useState(50);
  const [internetFee, setInternetFee] = useState(25);
  const [fuelLiters, setFuelLiters] = useState(80);
  const [loanAmount, setLoanAmount] = useState(0);
  const [insuranceFee, setInsuranceFee] = useState(40);

  // Personal categories (manual input)
  const [food, setFood] = useState(500);
  const [health, setHealth] = useState(80);
  const [education, setEducation] = useState(50);
  const [transport, setTransport] = useState(100);
  const [entertainment, setEntertainment] = useState(60);
  const [other, setOther] = useState(150);

  // Calculate from our calculators
  const elecCheapest = useMemo(() => {
    const r = calculateElectricityBills({
      meterType: "dual",
      dayKwh: electricityKwh,
      nightKwh: Math.round(electricityKwh * 0.4),
    });
    return r[0]?.totalWithVat ?? 0;
  }, [electricityKwh]);

  const waterCheapest = useMemo(() => {
    const r = calculateWaterBills({ consumptionM3: waterM3 });
    return r[0]?.totalWithVat ?? 0;
  }, [waterM3]);

  const gasCheapest = useMemo(() => {
    const r = calculateGasBills({ consumptionM3: gasM3 });
    return r[0]?.totalWithVat ?? 0;
  }, [gasM3]);

  const fuelCheapest = useMemo(() => {
    const r = calculateFuelCosts({ fuelType: "A95", monthlyLiters: fuelLiters });
    return r[0]?.monthlyCost ?? 0;
  }, [fuelLiters]);

  const loanPayment = useMemo(() => {
    if (loanAmount <= 0) return 0;
    const r = calculateLoans({ amount: loanAmount, termMonths: 60, type: "consumer" });
    return r[0]?.monthlyPayment ?? 0;
  }, [loanAmount]);

  // Build categories
  const categories: BudgetCategory[] = [
    {
      id: "food",
      label: "Храна и напитки",
      icon: <ShoppingCart className="h-4 w-4" />,
      color: COLORS[0],
      amount: food,
    },
    {
      id: "fuel",
      label: "Горива",
      icon: <Fuel className="h-4 w-4" />,
      color: COLORS[1],
      amount: fuelCheapest,
      calculatorLink: "/goriva",
      calculatorLabel: "Сравни горива",
      savingTip: "Избери по-евтина верига",
    },
    {
      id: "transport",
      label: "Транспорт (без горива)",
      icon: <Bus className="h-4 w-4" />,
      color: COLORS[2],
      amount: transport,
    },
    {
      id: "electricity",
      label: "Електричество",
      icon: <Zap className="h-4 w-4" />,
      color: COLORS[3],
      amount: elecCheapest,
      calculatorLink: "/elektrichestvo",
      calculatorLabel: "Калкулатор ток",
      savingTip: "Използвай нощна тарифа",
    },
    {
      id: "health",
      label: "Здраве и лекарства",
      icon: <Heart className="h-4 w-4" />,
      color: COLORS[4],
      amount: health,
    },
    {
      id: "water",
      label: "Вода",
      icon: <Droplets className="h-4 w-4" />,
      color: COLORS[5],
      amount: waterCheapest,
      calculatorLink: "/voda",
      calculatorLabel: "Калкулатор вода",
      savingTip: "Монтирай аератори на крановете",
    },
    {
      id: "gas",
      label: "Газ",
      icon: <Flame className="h-4 w-4" />,
      color: COLORS[6],
      amount: gasCheapest,
      calculatorLink: "/gaz",
      calculatorLabel: "Калкулатор газ",
    },
    {
      id: "internet",
      label: "Интернет и телеком",
      icon: <Wifi className="h-4 w-4" />,
      color: COLORS[7],
      amount: internetFee,
      calculatorLink: "/internet",
      calculatorLabel: "Сравни планове",
      savingTip: "Сравни оператори",
    },
    {
      id: "entertainment",
      label: "Развлечения",
      icon: <Tv className="h-4 w-4" />,
      color: COLORS[8],
      amount: entertainment,
    },
    {
      id: "education",
      label: "Образование",
      icon: <GraduationCap className="h-4 w-4" />,
      color: COLORS[9],
      amount: education,
    },
    {
      id: "insurance",
      label: "Застраховки",
      icon: <ShieldCheck className="h-4 w-4" />,
      color: COLORS[10],
      amount: insuranceFee,
      calculatorLink: "/zastrahovki",
      calculatorLabel: "Сравни застраховки",
    },
    ...(loanPayment > 0
      ? [
          {
            id: "loan",
            label: "Кредит",
            icon: <Landmark className="h-4 w-4" />,
            color: COLORS[11],
            amount: loanPayment,
            calculatorLink: "/krediti",
            calculatorLabel: "Кредитен калкулатор",
            savingTip: "Сравни лихвите",
          },
        ]
      : []),
    {
      id: "other",
      label: "Други разходи",
      icon: <Wallet className="h-4 w-4" />,
      color: "#9ca3af",
      amount: other,
    },
  ];

  const totalExpenses = categories.reduce((s, c) => s + c.amount, 0);
  const savings = income - totalExpenses;
  const savingsPercent = income > 0 ? ((savings / income) * 100).toFixed(1) : "0";

  // Compare with average
  const avgTotal =
    BG_AVERAGE.electricity + BG_AVERAGE.water + BG_AVERAGE.gas +
    BG_AVERAGE.internet + BG_AVERAGE.fuel + BG_AVERAGE.insurance +
    BG_AVERAGE.food + BG_AVERAGE.health + BG_AVERAGE.education +
    BG_AVERAGE.transport + BG_AVERAGE.entertainment + BG_AVERAGE.other;

  const pieData = categories
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const barData = [
    { name: "Ток", you: elecCheapest, avg: BG_AVERAGE.electricity },
    { name: "Вода", you: waterCheapest, avg: BG_AVERAGE.water },
    { name: "Газ", you: gasCheapest, avg: BG_AVERAGE.gas },
    { name: "Интернет", you: internetFee, avg: BG_AVERAGE.internet },
    { name: "Горива", you: fuelCheapest, avg: BG_AVERAGE.fuel },
    { name: "Храна", you: food, avg: BG_AVERAGE.food },
  ];

  return (
    <div className="space-y-8">
      {/* Income */}
      <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text">Месечен доход на домакинството</h2>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-32 rounded-lg border border-border bg-surface px-3 py-2 text-lg font-bold text-text"
          />
          <span className="text-muted">€/месец</span>
          <input
            type="range"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            min={500}
            max={15000}
            step={100}
            className="flex-1 accent-primary"
          />
        </div>
      </div>

      {/* Expense inputs grid */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">Месечни разходи</h2>

        <div className="mb-3 text-xs text-muted">
          <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-primary font-medium">
            Зелено = свързано с калкулатор
          </span>{" "}
          Тези стойности се изчисляват автоматично при промяна на потреблението.
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <BudgetInput label="Ток (kWh)" value={electricityKwh} onChange={setElectricityKwh} min={0} max={1000} step={10} linked icon={<Zap className="h-3.5 w-3.5 text-yellow-500" />} result={formatCurrency(elecCheapest)} />
          <BudgetInput label="Вода (m³)" value={waterM3} onChange={setWaterM3} min={0} max={50} step={1} linked icon={<Droplets className="h-3.5 w-3.5 text-blue-500" />} result={formatCurrency(waterCheapest)} />
          <BudgetInput label="Газ (m³)" value={gasM3} onChange={setGasM3} min={0} max={500} step={10} linked icon={<Flame className="h-3.5 w-3.5 text-orange-500" />} result={formatCurrency(gasCheapest)} />
          <BudgetInput label="Интернет (€)" value={internetFee} onChange={setInternetFee} min={0} max={100} step={1} linked icon={<Wifi className="h-3.5 w-3.5 text-green-500" />} />
          <BudgetInput label="Горива (литри)" value={fuelLiters} onChange={setFuelLiters} min={0} max={400} step={10} linked icon={<Fuel className="h-3.5 w-3.5 text-blue-600" />} result={formatCurrency(fuelCheapest)} />
          <BudgetInput label="Кредит сума (€)" value={loanAmount} onChange={setLoanAmount} min={0} max={80000} step={500} linked icon={<Landmark className="h-3.5 w-3.5 text-purple-500" />} result={loanPayment > 0 ? `${formatCurrency(loanPayment)}/мес` : undefined} />
          <BudgetInput label="Застраховки (€)" value={insuranceFee} onChange={setInsuranceFee} min={0} max={500} step={5} linked icon={<ShieldCheck className="h-3.5 w-3.5 text-teal-500" />} />
          <BudgetInput label="Храна и напитки (€)" value={food} onChange={setFood} min={0} max={3000} step={50} icon={<ShoppingCart className="h-3.5 w-3.5 text-gray-500" />} />
          <BudgetInput label="Здраве (€)" value={health} onChange={setHealth} min={0} max={1000} step={10} icon={<Heart className="h-3.5 w-3.5 text-red-500" />} />
          <BudgetInput label="Образование (€)" value={education} onChange={setEducation} min={0} max={2000} step={25} icon={<GraduationCap className="h-3.5 w-3.5 text-indigo-500" />} />
          <BudgetInput label="Транспорт (€)" value={transport} onChange={setTransport} min={0} max={500} step={10} icon={<Bus className="h-3.5 w-3.5 text-amber-500" />} />
          <BudgetInput label="Развлечения (€)" value={entertainment} onChange={setEntertainment} min={0} max={500} step={10} icon={<Tv className="h-3.5 w-3.5 text-pink-500" />} />
          <BudgetInput label="Други разходи (€)" value={other} onChange={setOther} min={0} max={2000} step={25} icon={<Wallet className="h-3.5 w-3.5 text-gray-400" />} />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-xs text-muted">Общо разходи</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-muted">= {formatCurrency(totalExpenses * 12)}/год</p>
        </div>
        <div className={`rounded-2xl border-2 p-4 text-center ${savings >= 0 ? "border-primary bg-primary/5" : "border-red-400 bg-red-50"}`}>
          <p className="text-xs text-muted">{savings >= 0 ? "Спестявания" : "Дефицит"}</p>
          <p className={`text-2xl font-bold ${savings >= 0 ? "text-primary" : "text-red-600"}`}>
            {formatCurrency(Math.abs(savings))}
          </p>
          <p className="text-xs text-muted">{savingsPercent}% от дохода</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 text-center">
          <p className="text-xs text-muted">Средно за България</p>
          <p className="text-2xl font-bold text-muted">{formatCurrency(avgTotal)}</p>
          <p className="text-xs text-muted">
            {totalExpenses < avgTotal ? (
              <span className="text-primary">Ти харчиш по-малко!</span>
            ) : (
              <span className="text-red-500">Над средното</span>
            )}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-3 font-semibold text-text">Разпределение на разходите</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="amount"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {pieData.slice(0, 6).map((c) => (
              <span key={c.id} className="flex items-center gap-1 text-xs text-muted">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* vs Average bar chart */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-3 font-semibold text-text">Ти vs Средно за България</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v} €`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="you" name="Твоите" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg" name="Средно БГ" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted text-center">
            Средни стойности по данни на НСИ и Eurostat за 2024.
          </p>
        </div>
      </div>

      {/* Saving tips with links */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-text">Къде можеш да спестиш?</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter((c) => c.calculatorLink && c.amount > 0)
            .map((c) => (
              <Link
                key={c.id}
                href={c.calculatorLink!}
                className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center gap-2">
                  {c.icon}
                  <div>
                    <p className="text-sm font-medium text-text">{c.label}</p>
                    <p className="text-xs text-muted">
                      {c.savingTip || c.calculatorLabel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-text">{formatCurrency(c.amount)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

function BudgetInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  linked,
  icon,
  result,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  linked?: boolean;
  icon: React.ReactNode;
  result?: string;
}) {
  return (
    <div className={`rounded-lg border p-2.5 ${linked ? "border-primary/20 bg-primary/5" : "border-border"}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {icon}
          <label className="text-xs font-medium text-muted">{label}</label>
        </div>
        {result && (
          <span className="text-xs font-bold text-primary">{result}</span>
        )}
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full rounded border border-border bg-surface px-2 py-1 text-sm text-text focus:border-primary focus:outline-none"
      />
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="mt-1 w-full accent-primary"
      />
    </div>
  );
}
