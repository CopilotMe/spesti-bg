"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { refUrl } from "@/lib/ref";
import { Trophy, ExternalLink, Share2, Check } from "lucide-react";
import messages from "@/messages/bg.json";

interface ResultRow {
  providerName: string;
  region?: string;
  total: number;
  difference: number;
  isCheapest: boolean;
  url?: string;
}

interface ResultsTableProps {
  rows: ResultRow[];
}

export function ResultsTable({ rows }: ResultsTableProps) {
  const t = messages.calculator;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = async (row: ResultRow) => {
    const text = `${row.providerName}${row.region ? ` (${row.region})` : ""} — ${formatCurrency(row.total)}/мес.${row.isCheapest ? " ✅ Най-евтин!" : ` (+${formatCurrency(row.difference)} спрямо най-евтиния)`}\n\nВиж сравнението на Спести: ${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Спести", text });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(row.providerName);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard API not available
    }
  };

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
            <th className="px-4 py-3 text-center font-medium text-muted">
              Сайт
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted">
              <span className="sr-only">Споделяне</span>
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
              <td className="px-4 py-3 text-center">
                {row.url ? (
                  <a
                    href={refUrl(row.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      row.isCheapest
                        ? "bg-primary text-white hover:bg-primary-dark"
                        : "bg-gray-100 text-muted hover:bg-gray-200 hover:text-text"
                    }`}
                  >
                    Към сайта
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs text-muted">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleShare(row)}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-muted transition-colors hover:bg-gray-200 hover:text-text"
                  title="Сподели тази оферта"
                  aria-label={`Сподели ${row.providerName}`}
                >
                  {copiedId === row.providerName ? (
                    <>
                      <Check className="h-3 w-3 text-primary" />
                      <span className="text-primary">Копирано</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3 w-3" />
                      <span className="hidden sm:inline">Сподели</span>
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
