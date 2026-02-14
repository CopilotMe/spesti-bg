import { formatCurrency } from "@/lib/utils";
import { Trophy } from "lucide-react";
import messages from "@/messages/bg.json";

interface ResultRow {
  providerName: string;
  region?: string;
  total: number;
  difference: number;
  isCheapest: boolean;
}

interface ResultsTableProps {
  rows: ResultRow[];
}

export function ResultsTable({ rows }: ResultsTableProps) {
  const t = messages.calculator;

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-gray-50">
            <th className="px-4 py-3 text-left font-medium text-muted">
              {t.provider}
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted">
              {t.total}
            </th>
            <th className="px-4 py-3 text-right font-medium text-muted">
              {t.difference}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.providerName}
              className={`border-b border-border last:border-b-0 ${
                row.isCheapest ? "bg-primary/5" : ""
              }`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {row.isCheapest && (
                    <Trophy className="h-4 w-4 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-text">{row.providerName}</p>
                    {row.region && (
                      <p className="text-xs text-muted">{row.region}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={`font-semibold ${
                    row.isCheapest ? "text-primary" : "text-text"
                  }`}
                >
                  {formatCurrency(row.total)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {row.isCheapest ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {t.cheapest}
                  </span>
                ) : (
                  <span className="text-xs text-accent">
                    +{formatCurrency(row.difference)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
