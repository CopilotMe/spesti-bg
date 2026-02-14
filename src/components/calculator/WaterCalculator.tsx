"use client";

import { useState, useMemo } from "react";
import { Droplets } from "lucide-react";
import { calculateWaterBills } from "@/lib/calculators/water";
import { waterProviders } from "@/data/water";
import { ConsumptionInput } from "./ConsumptionInput";
import { ResultsTable } from "./ResultsTable";
import { ExplainTooltip } from "./Tooltip";
import { BillBreakdownPie } from "@/components/charts/BillBreakdownPie";
import { ProviderComparisonBar } from "@/components/charts/ProviderComparisonBar";
import { formatCurrency } from "@/lib/utils";
import messages from "@/messages/bg.json";

export function WaterCalculator() {
  const t = messages.calculator;

  const [selectedCity, setSelectedCity] = useState("София");
  const [consumptionM3, setConsumptionM3] = useState(5);

  const results = useMemo(
    () => calculateWaterBills({ consumptionM3 }),
    [consumptionM3]
  );

  const selectedResult = results.find(
    (r) => r.provider.city === selectedCity
  );

  const cities = waterProviders.map((p) => p.city).sort((a, b) => a.localeCompare(b, "bg"));

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-secondary" />
          <h2 className="text-lg font-semibold text-text">
            {messages.categories.water.title}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* City */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">
              {t.selectCity}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Consumption */}
          <ConsumptionInput
            label={t.waterConsumption}
            value={consumptionM3}
            onChange={setConsumptionM3}
            min={0}
            max={50}
            step={1}
            unit="m³"
          />
        </div>
      </div>

      {/* Results table - all cities */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-text">
          {t.comparison} (за {consumptionM3} m³)
        </h3>
        <ResultsTable
          rows={results.map((r) => ({
            providerName: r.provider.name,
            region: r.provider.city,
            total: r.totalWithVat,
            difference: r.differenceFromCheapest,
            isCheapest: r.isCheapest,
            url: r.provider.url,
          }))}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ProviderComparisonBar
          title={`${t.comparison} (${consumptionM3} m³)`}
          data={results.map((r) => ({
            name: r.provider.city,
            total: r.totalWithVat,
            isCheapest: r.isCheapest,
          }))}
        />
        {selectedResult && (
          <BillBreakdownPie
            title={`${t.billBreakdown} (${selectedCity})`}
            data={[
              {
                name: "Водоснабдяване",
                value: selectedResult.supplyAmount,
              },
              {
                name: "Канализация",
                value: selectedResult.sewerageAmount,
              },
              {
                name: "Пречистване",
                value: selectedResult.treatmentAmount,
              },
              { name: "ДДС", value: selectedResult.vat },
            ]}
          />
        )}
      </div>

      {/* Bill breakdown with tooltips */}
      {selectedResult && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="mb-4 text-lg font-semibold text-text">
            {t.billBreakdown} ({selectedResult.provider.name})
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-text">Водоснабдяване</span>
                <ExplainTooltip explanationKey="water_supply" />
              </div>
              <span className="text-sm font-medium text-text">
                {formatCurrency(selectedResult.supplyAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-text">Канализация</span>
                <ExplainTooltip explanationKey="water_sewerage" />
              </div>
              <span className="text-sm font-medium text-text">
                {formatCurrency(selectedResult.sewerageAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-text">Пречистване</span>
                <ExplainTooltip explanationKey="water_treatment" />
              </div>
              <span className="text-sm font-medium text-text">
                {formatCurrency(selectedResult.treatmentAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-text">ДДС (20%)</span>
                <ExplainTooltip explanationKey="vat" />
              </div>
              <span className="text-sm font-medium text-text">
                {formatCurrency(selectedResult.vat)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold text-text">
                {t.total} ({t.withVat})
              </span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(selectedResult.totalWithVat)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
