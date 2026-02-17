"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "#059669",
  "#2563EB",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

interface PieData {
  name: string;
  value: number;
}

interface BillBreakdownPieProps {
  data: PieData[];
  title: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-sm min-w-[120px]">
        <p className="text-xs font-medium text-text truncate">{payload[0].name}</p>
        <p className="text-sm font-semibold text-primary">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export function BillBreakdownPie({ data, title }: BillBreakdownPieProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-4 text-sm font-semibold text-text">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={(props) => {
                const name = props.name ?? "";
                const percent = typeof props.percent === "number" ? props.percent : 0;
                return `${name} (${(percent * 100).toFixed(0)}%)`;
              }}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-muted">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
