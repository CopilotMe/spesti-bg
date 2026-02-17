"use client";

import { useId } from "react";

interface ConsumptionInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit: string;
}

export function ConsumptionInput({
  label,
  value,
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  unit,
}: ConsumptionInputProps) {
  const id = useId();
  const rangeId = `${id}-range`;
  const numberId = `${id}-number`;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={rangeId} className="text-sm font-medium text-text">{label}</label>
        <span className="text-sm font-semibold text-primary">
          {value} {unit}
        </span>
      </div>
      <input
        id={rangeId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-primary"
      />
      <div className="flex items-center gap-2">
        <input
          id={numberId}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= min && v <= max) onChange(v);
          }}
          className="w-24 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label={label}
        />
        <span className="text-xs text-muted">{unit}</span>
      </div>
    </div>
  );
}
