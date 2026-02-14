"use client";

import { useState, useMemo } from "react";
import { Zap } from "lucide-react";
import { MeterType } from "@/lib/types";
import { calculateElectricityBills } from "@/lib/calculators/electricity";
import { electricityProviders, allCoverageAreas } from "@/data/electricity";
import { ConsumptionInput } from "./ConsumptionInput";
import { ResultsTable } from "./ResultsTable";
import { ExplainTooltip } from "./Tooltip";
import { BillBreakdownPie } from "@/components/charts/BillBreakdownPie";
import { ProviderComparisonBar } from "@/components/charts/ProviderComparisonBar";
import { formatCurrency } from "@/lib/utils";
import messages from "@/messages/bg.json";

export function ElectricityCalculator() {
  const t = messages.calculator;

  const [selectedArea, setSelectedArea] = useState("");
  const [meterType, setMeterType] = useState<MeterType>("dual");
  const [dayKwh, setDayKwh] = useState(200);
  const [nightKwh, setNightKwh] = useState(100);

  const results = useMemo(
    () =>
      calculateElectricityBills({
        meterType,
        dayKwh,
        nightKwh: meterType === "dual" ? nightKwh : 0,
      }),
    [meterType, dayKwh, nightKwh]
  );

  const selectedProvider = selectedArea
    ? electricityProviders.find((p) => p.coverageAreas.includes(selectedArea))
    : null;

  const selectedResult = selectedProvider
    ? results.find((r) => r.provider.id === selectedProvider.id)
    : results[0];

  const uniqueAreas = allCoverageAreas
    .map((a) => a.area)
    .sort((a, b) => a.localeCompare(b, "bg"));

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text">
            {messages.categories.electricity.title}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Region */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">
              {t.region}
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">{t.selectRegion}</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            {selectedProvider && (
              <p className="text-xs text-muted">
                Твоят доставчик: <strong>{selectedProvider.name}</strong> ({selectedProvider.region})
              </p>
            )}
          </div>

          {/* Meter type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">
              {t.meterType}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMeterType("single")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  meterType === "single"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-muted hover:bg-gray-200"
                }`}
              >
                {t.singleMeter}
              </button>
              <button
                onClick={() => setMeterType("dual")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  meterType === "dual"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-muted hover:bg-gray-200"
                }`}
              >
                {t.dualMeter}
              </button>
            </div>
          </div>
        </div>

        {/* Consumption sliders */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <ConsumptionInput
            label={
              meterType === "dual" ? t.dayConsumption : t.totalConsumption
            }
            value={dayKwh}
            onChange={setDayKwh}
            min={0}
            max={1000}
            step={10}
            unit="kWh"
          />
          {meterType === "dual" && (
            <ConsumptionInput
              label={t.nightConsumption}
              value={nightKwh}
              onChange={setNightKwh}
              min={0}
              max={500}
              step={10}
              unit="kWh"
            />
          )}
        </div>
      </div>

      {/* Results table */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-text">
          {t.comparison}
        </h3>
        <ResultsTable
          rows={results.map((r) => ({
            providerName: r.provider.name,
            region: r.provider.region,
            total: r.totalWithVat,
            difference: r.differenceFromCheapest,
            isCheapest: r.isCheapest,
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
            data={selectedResult.breakdown.map((b) => ({
              name: b.component.name,
              value: Math.round(b.amount * 100) / 100,
            }))}
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
            {selectedResult.breakdown.map((b) => (
              <div
                key={b.component.id}
                className="flex items-center justify-between border-b border-border pb-2 last:border-b-0"
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm text-text">
                    {b.component.name}
                  </span>
                  <ExplainTooltip
                    explanationKey={b.component.explanationKey}
                  />
                </div>
                <span className="text-sm font-medium text-text">
                  {formatCurrency(b.amount)}
                </span>
              </div>
            ))}
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
