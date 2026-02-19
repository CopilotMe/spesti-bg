"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calculator,
  Loader2,
  Info,
  Users,
  Building2,
  TrendingUp,
  Globe,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  calculateNetFromGross,
  SALARY_CONSTANTS,
  type SalaryBreakdown,
} from "@/lib/salary";
import { fetchLabourCosts, type LabourCostData } from "@/lib/api";

const PIE_COLORS = ["#059669", "#3b82f6", "#8b5cf6", "#f97316", "#ef4444", "#ec4899"];

function formatEur(n: number): string {
  return n.toFixed(2) + " EUR";
}

function BreakdownRow({
  label,
  amount,
  rate,
  color,
}: {
  label: string;
  amount: number;
  rate: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm" style={{ background: color }} />
        <span className="text-muted">{label}</span>
      </div>
      <div className="text-right">
        <span className="font-medium text-text">{formatEur(amount)}</span>
        <span className="ml-2 text-xs text-muted">({rate}%)</span>
      </div>
    </div>
  );
}

export function LabourCostCalculator() {
  const [grossEur, setGrossEur] = useState(SALARY_CONSTANTS.avgWageEur);
  const [headcount, setHeadcount] = useState(1);
  const [labourCosts, setLabourCosts] = useState<LabourCostData | null>(null);
  const [loadingEu, setLoadingEu] = useState(true);

  useEffect(() => {
    fetchLabourCosts().then((d) => {
      setLabourCosts(d);
      setLoadingEu(false);
    });
  }, []);

  const breakdown = useMemo(
    () => calculateNetFromGross(grossEur),
    [grossEur],
  );

  // Employer contribution breakdown
  const rates = SALARY_CONSTANTS.rates;
  const insurableIncome = Math.min(
    grossEur,
    SALARY_CONSTANTS.maxInsuranceIncomeEur,
  );

  const employerParts = [
    { label: "ДОО (пенсионен)", rate: rates.employerDoo, amount: insurableIncome * rates.employerDoo / 100, color: PIE_COLORS[0] },
    { label: "ДЗПО (допълнително)", rate: rates.employerDzpo, amount: insurableIncome * rates.employerDzpo / 100, color: PIE_COLORS[1] },
    { label: "ЗО (здравно)", rate: rates.employerZo, amount: insurableIncome * rates.employerZo / 100, color: PIE_COLORS[2] },
    { label: "ТЗПБ (трудова злоп.)", rate: rates.employerTzpb, amount: insurableIncome * rates.employerTzpb / 100, color: PIE_COLORS[3] },
    { label: "ГВРС (гарантирани вз.)", rate: rates.employerGvrs, amount: insurableIncome * rates.employerGvrs / 100, color: PIE_COLORS[4] },
  ];

  const costBreakdownChart = [
    { name: "Нето на служител", value: Math.round(breakdown.netEur * 100) / 100 },
    { name: "Осигуровки (служител)", value: Math.round((breakdown.totalEmployeeInsuranceEur + breakdown.incomeTaxEur) * 100) / 100 },
    { name: "Осигуровки (работодател)", value: Math.round(breakdown.employerInsuranceEur * 100) / 100 },
  ];

  // EU comparison chart
  const euChartData = useMemo(() => {
    if (!labourCosts) return [];
    return labourCosts.wagesPerHour
      .map((w) => {
        const total = labourCosts.totalPerHour.find((t) => t.geo === w.geo);
        return {
          country: w.label,
          wages: w.value ?? 0,
          nonWage: total && w.value ? total.value - w.value : 0,
          total: total?.value ?? w.value ?? 0,
          isBg: w.geo === "BG",
        };
      })
      .sort((a, b) => a.total - b.total);
  }, [labourCosts]);

  return (
    <div className="space-y-6">
      {/* Input controls */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-border bg-surface p-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            <Users className="mr-1 inline h-4 w-4" />
            Бруто заплата (EUR)
          </label>
          <input
            type="number"
            value={grossEur}
            onChange={(e) => setGrossEur(Math.max(0, Number(e.target.value)))}
            min={0}
            className="w-36 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            <Building2 className="mr-1 inline h-4 w-4" />
            Брой служители
          </label>
          <input
            type="number"
            value={headcount}
            onChange={(e) => setHeadcount(Math.max(1, Number(e.target.value)))}
            min={1}
            className="w-24 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-muted hover:bg-gray-200"
            onClick={() => setGrossEur(SALARY_CONSTANTS.minWageEur)}
          >
            МРЗ ({SALARY_CONSTANTS.minWageEur} EUR)
          </button>
          <button
            className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-muted hover:bg-gray-200"
            onClick={() => setGrossEur(SALARY_CONSTANTS.avgWageEur)}
          >
            Средна ({SALARY_CONSTANTS.avgWageEur} EUR)
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-primary bg-primary/5 p-5">
          <p className="text-sm text-muted">Обща цена за работодателя</p>
          <p className="text-2xl font-bold text-primary">
            {formatEur(breakdown.totalCostEur * headcount)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {headcount > 1 ? `${headcount} служители ×` : ""} {formatEur(breakdown.totalCostEur)}/служител
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Бруто заплата</p>
          <p className="text-2xl font-bold text-text">
            {formatEur(breakdown.grossEur)}
          </p>
          <p className="mt-1 text-xs text-muted">
            Нето: {formatEur(breakdown.netEur)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">Осигуровки работодател</p>
          <p className="text-2xl font-bold text-text">
            {formatEur(breakdown.employerInsuranceEur)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {(SALARY_CONSTANTS.employerTotalRate * 100).toFixed(2)}% от осиг. доход
          </p>
        </div>
      </div>

      {/* Cost breakdown pie chart + table */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-semibold text-text">
            Разбивка на общата цена
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={costBreakdownChart}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {costBreakdownChart.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatEur(Number(v))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-semibold text-text">
            Осигуровки на работодателя
          </h2>
          <div className="divide-y divide-border">
            {employerParts.map((p) => (
              <BreakdownRow
                key={p.label}
                label={p.label}
                amount={p.amount}
                rate={p.rate}
                color={p.color}
              />
            ))}
            <div className="flex items-center justify-between pt-2 text-sm font-semibold">
              <span className="text-text">Общо работодател</span>
              <span className="text-text">
                {formatEur(breakdown.employerInsuranceEur)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* EU comparison */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-text">
            Часова цена на труда — България vs ЕС
          </h2>
        </div>
        {loadingEu ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-muted">Зареждане от Eurostat...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={euChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" unit=" EUR" fontSize={12} />
              <YAxis dataKey="country" type="category" width={85} fontSize={12} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(2)} EUR/час`} />
              <Legend />
              <Bar
                dataKey="wages"
                name="Заплата"
                stackId="a"
                fill="#059669"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="nonWage"
                name="Осигуровки"
                stackId="a"
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
        <p className="mt-2 text-xs text-muted">
          Данни от Eurostat (lc_lci_lev). Часова цена на труда включва заплата + осигуровки + данъци.
        </p>
      </div>

      {/* Methodology */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted space-y-1">
            <p>
              <strong className="text-text">Ставки 2026:</strong> ДОО
              (пенсионен) — {rates.employerDoo}% работодател / {rates.employeeDoo}%
              работник. ДЗПО — {rates.employerDzpo}% / {rates.employeeDzpo}%. ЗО —{" "}
              {rates.employerZo}% / {rates.employeeZo}%. ГВРС — {rates.employerGvrs}%.
              ТЗПБ — {rates.employerTzpb}% (средно).
            </p>
            <p>
              Макс. осигурителен доход: {SALARY_CONSTANTS.maxInsuranceIncomeEur.toFixed(2)} EUR
              (3750 лв). Данък общ доход: 10%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
