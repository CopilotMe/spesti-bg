"use client";

import { useState, useMemo, useEffect } from "react";
import { LayoutDashboard, Zap, Droplets, Flame, Wifi, Landmark, TrendingDown } from "lucide-react";
import { calculateElectricityBills } from "@/lib/calculators/electricity";
import { calculateWaterBills } from "@/lib/calculators/water";
import { calculateGasBills } from "@/lib/calculators/gas";
import { calculateLoans } from "@/lib/calculators/loans";
import { formatCurrency } from "@/lib/utils";
import { ProviderComparisonBar } from "@/components/charts/ProviderComparisonBar";

interface EcbRate {
  period: string;
  consumerRate: number | null;
  mortgageRate: number | null;
}

export function CombinedDashboard() {
  const [electricityKwh, setElectricityKwh] = useState(200);
  const [waterM3, setWaterM3] = useState(5);
  const [gasM3, setGasM3] = useState(50);
  const [internetFee, setInternetFee] = useState(25);
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanTermMonths, setLoanTermMonths] = useState(60);

  const [ecbRate, setEcbRate] = useState<EcbRate | null>(null);
  const [ecbLoading, setEcbLoading] = useState(true);

  // Fetch ECB interest rates for Bulgaria
  useEffect(() => {
    async function fetchEcbRates() {
      try {
        const res = await fetch(
          "https://data-api.ecb.europa.eu/service/data/MIR/M.BG.B.A2B.A.C.A.2250.EUR.N?lastNObservations=1&format=csvdata"
        );
        const text = await res.text();
        const lines = text.trim().split("\n");
        if (lines.length >= 2) {
          const headers = lines[0].split(",");
          const values = lines[1].split(",");
          const periodIdx = headers.indexOf("TIME_PERIOD");
          const valueIdx = headers.indexOf("OBS_VALUE");
          const period = periodIdx >= 0 ? values[periodIdx] : "";
          const rate = valueIdx >= 0 ? parseFloat(values[valueIdx]) : NaN;
          setEcbRate({
            period: period || "",
            consumerRate: isNaN(rate) ? null : rate,
            mortgageRate: null,
          });
        }
      } catch {
        // ECB API not available
      }
      setEcbLoading(false);
    }
    fetchEcbRates();
  }, []);

  const elecResults = useMemo(
    () => calculateElectricityBills({ meterType: "dual", dayKwh: electricityKwh, nightKwh: Math.round(electricityKwh * 0.4) }),
    [electricityKwh]
  );
  const waterResults = useMemo(
    () => calculateWaterBills({ consumptionM3: waterM3 }),
    [waterM3]
  );
  const gasResults = useMemo(
    () => calculateGasBills({ consumptionM3: gasM3 }),
    [gasM3]
  );
  const loanResults = useMemo(
    () => loanAmount > 0 ? calculateLoans({ amount: loanAmount, termMonths: loanTermMonths, type: "consumer" }) : [],
    [loanAmount, loanTermMonths]
  );

  const cheapestElec = elecResults[0]?.totalWithVat ?? 0;
  const cheapestWater = waterResults[0]?.totalWithVat ?? 0;
  const cheapestGas = gasResults[0]?.totalWithVat ?? 0;
  const cheapestLoan = loanResults[0]?.monthlyPayment ?? 0;
  const totalMonthly = cheapestElec + cheapestWater + cheapestGas + internetFee + cheapestLoan;

  const breakdownData = [
    { name: "Ток", total: cheapestElec, isCheapest: false },
    { name: "Вода", total: cheapestWater, isCheapest: false },
    { name: "Газ", total: cheapestGas, isCheapest: false },
    { name: "Интернет", total: internetFee, isCheapest: false },
    ...(cheapestLoan > 0 ? [{ name: "Кредит", total: cheapestLoan, isCheapest: false }] : []),
  ].sort((a, b) => b.total - a.total);

  if (breakdownData.length > 0) breakdownData[0].isCheapest = true;

  return (
    <div className="space-y-8">
      {/* ECB Live Data */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            Средна лихва по потребителски кредити в България (ECB данни)
          </span>
        </div>
        {ecbLoading ? (
          <p className="text-sm text-muted">Зареждане от ECB API...</p>
        ) : ecbRate?.consumerRate ? (
          <p className="text-sm text-text">
            <span className="text-2xl font-bold text-primary">{ecbRate.consumerRate.toFixed(2)}%</span>
            {" "}годишна лихва (период: {ecbRate.period})
            <span className="ml-2 text-xs text-muted">Източник: European Central Bank</span>
          </p>
        ) : (
          <p className="text-sm text-muted">ECB данните не са налични в момента.</p>
        )}
      </div>

      {/* Input controls */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text">Месечни разходи на домакинството</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InputCard icon={<Zap className="h-4 w-4 text-yellow-500" />} label="Ток (kWh/мес)" value={electricityKwh} onChange={setElectricityKwh} min={0} max={1000} step={10} />
          <InputCard icon={<Droplets className="h-4 w-4 text-blue-500" />} label="Вода (m³/мес)" value={waterM3} onChange={setWaterM3} min={0} max={50} step={1} />
          <InputCard icon={<Flame className="h-4 w-4 text-orange-500" />} label="Газ (m³/мес)" value={gasM3} onChange={setGasM3} min={0} max={500} step={10} />
          <InputCard icon={<Wifi className="h-4 w-4 text-green-500" />} label="Интернет (лв/мес)" value={internetFee} onChange={setInternetFee} min={0} max={100} step={1} />
          <InputCard icon={<Landmark className="h-4 w-4 text-purple-500" />} label="Кредит сума (лв)" value={loanAmount} onChange={setLoanAmount} min={0} max={80000} step={500} />
          {loanAmount > 0 && (
            <InputCard icon={<Landmark className="h-4 w-4 text-purple-500" />} label="Кредит срок (мес)" value={loanTermMonths} onChange={setLoanTermMonths} min={6} max={120} step={6} />
          )}
        </div>
      </div>

      {/* Total */}
      <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 text-center">
        <p className="text-sm text-muted">Общо месечни разходи (при най-евтиния доставчик)</p>
        <p className="text-4xl font-bold text-primary">{formatCurrency(totalMonthly)}</p>
        <p className="mt-1 text-xs text-muted">
          = {formatCurrency(totalMonthly * 12)} годишно
        </p>
      </div>

      {/* Breakdown cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <BreakdownCard label="Ток" amount={cheapestElec} provider={elecResults[0]?.provider.name} color="text-yellow-600" icon={<Zap className="h-4 w-4" />} />
        <BreakdownCard label="Вода" amount={cheapestWater} provider={waterResults[0]?.provider.name} color="text-blue-600" icon={<Droplets className="h-4 w-4" />} />
        <BreakdownCard label="Газ" amount={cheapestGas} provider={gasResults[0]?.provider.name} color="text-orange-600" icon={<Flame className="h-4 w-4" />} />
        <BreakdownCard label="Интернет" amount={internetFee} provider="Ръчно" color="text-green-600" icon={<Wifi className="h-4 w-4" />} />
        {cheapestLoan > 0 && (
          <BreakdownCard label="Кредит" amount={cheapestLoan} provider={loanResults[0]?.product.bankName} color="text-purple-600" icon={<Landmark className="h-4 w-4" />} />
        )}
      </div>

      {/* Chart */}
      <ProviderComparisonBar
        title="Разпределение на месечните разходи"
        data={breakdownData}
      />
    </div>
  );
}

function InputCard({ icon, label, value, onChange, min, max, step }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <label className="text-xs font-medium text-muted">{label}</label>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
      />
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full accent-primary"
      />
    </div>
  );
}

function BreakdownCard({ label, amount, provider, color, icon }: {
  label: string;
  amount: number;
  provider?: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <div className={`mb-1 flex items-center justify-center gap-1 ${color}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-text">{formatCurrency(amount)}</p>
      {provider && <p className="text-xs text-muted">{provider}</p>}
    </div>
  );
}
