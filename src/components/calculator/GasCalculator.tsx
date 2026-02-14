"use client";

import { useState, useMemo } from "react";
import { Flame } from "lucide-react";
import { calculateGasBills } from "@/lib/calculators/gas";
import { gasProviders, allGasCities } from "@/data/gas";
import { ConsumptionInput } from "./ConsumptionInput";
import { ResultsTable } from "./ResultsTable";
import { ExplainTooltip } from "./Tooltip";
import { BillBreakdownPie } from "@/components/charts/BillBreakdownPie";
import { ProviderComparisonBar } from "@/components/charts/ProviderComparisonBar";
import { formatCurrency } from "@/lib/utils";
import messages from "@/messages/bg.json";

export function GasCalculator() {
  const t = messages.calculator;

  const [selectedCity, setSelectedCity] = useState("");
  const [consumptionM3, setConsumptionM3] = useState(100);

  const results = useMemo(
    () => calculateGasBills({ consumptionM3 }),
    [consumptionM3]
  );

  const selectedProvider = selectedCity
    ? gasProviders.find((p) => p.coverageCities.includes(selectedCity))
    : null;

  const selectedResult = selectedProvider
    ? results.find((r) => r.provider.id === selectedProvider.id)
    : results[0];

  const uniqueCities = allGasCities
    .map((c) => c.city)
    .sort((a, b) => a.localeCompare(b, "bg"));

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-text">Газ за бита</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">
              Избери град
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Избери град</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {selectedProvider && (
              <p className="text-xs text-muted">
                Твоят доставчик: <strong>{selectedProvider.name}</strong> ({selectedProvider.region})
              </p>
            )}
          </div>

          <ConsumptionInput
            label="Месечно потребление (m³)"
            value={consumptionM3}
            onChange={setConsumptionM3}
            min={0}
            max={500}
            step={10}
            unit="m³"
          />
        </div>
      </div>

      {/* Results table */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-text">
          {t.comparison} (за {consumptionM3} m³ газ)
        </h3>
        <ResultsTable
          rows={results.map((r) => ({
            providerName: r.provider.name,
            region: r.provider.region,
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
          title={t.comparison}
          data={results.map((r) => ({
            name: r.provider.name,
            total: r.totalWithVat,
            isCheapest: r.isCheapest,
          }))}
        />
        {selectedResult && (
          <BillBreakdownPie
            title={t.billBreakdown}
            data={[
              { name: "Природен газ", value: selectedResult.gasAmount },
              { name: "Разпределение", value: selectedResult.distributionAmount },
              { name: "Пренос", value: selectedResult.transmissionAmount },
              { name: "Акциз", value: selectedResult.exciseAmount },
              { name: "ДДС", value: selectedResult.vat },
            ]}
          />
        )}
      </div>

      {/* Breakdown */}
      {selectedResult && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="mb-4 text-lg font-semibold text-text">
            {t.billBreakdown} ({selectedResult.provider.name})
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-text">Природен газ</span>
                <ExplainTooltip explanationKey="gas_commodity" />
              </div>
              <span className="text-sm font-medium text-text">
                {formatCurrency(selectedResult.gasAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-text">Разпределение</span>
                <ExplainTooltip explanationKey="gas_distribution" />
              </div>
              <span className="text-sm font-medium text-text">
                {formatCurrency(selectedResult.distributionAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-text">Пренос</span>
                <ExplainTooltip explanationKey="gas_transmission" />
              </div>
              <span className="text-sm font-medium text-text">
                {formatCurrency(selectedResult.transmissionAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm text-text">Акциз</span>
                <ExplainTooltip explanationKey="excise" />
              </div>
              <span className="text-sm font-medium text-text">
                {formatCurrency(selectedResult.exciseAmount)}
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
