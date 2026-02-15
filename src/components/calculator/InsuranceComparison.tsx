"use client";

import { useState, useMemo } from "react";
import { ShieldCheck, Trophy, ExternalLink, Share2, Check } from "lucide-react";
import { insuranceProducts, insuranceTypes } from "@/data/insurance";
import { formatCurrency } from "@/lib/utils";

export function InsuranceComparison() {
  const [selectedType, setSelectedType] = useState<string>("go");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      insuranceProducts
        .filter((p) => p.type === selectedType)
        .sort((a, b) => a.annualPremium - b.annualPremium),
    [selectedType]
  );

  const handleShare = async (id: string, insurerName: string, productName: string, annual: number) => {
    const text = `${insurerName} — ${productName}: ${formatCurrency(annual)}/год.\n\nВиж сравнението на Спести: ${window.location.href}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Спести", text }); return; } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* not available */ }
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-text">Сравни застраховки</h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text">Тип застраховка</label>
          <div className="flex flex-wrap gap-2">
            {insuranceTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedType === t.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-muted hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-muted">Застраховател</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Продукт</th>
              <th className="px-4 py-3 text-right font-medium text-muted">Месечно</th>
              <th className="px-4 py-3 text-right font-medium text-muted">Годишно</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Покритие</th>
              <th className="px-4 py-3 text-center font-medium text-muted">Сайт</th>
              <th className="px-4 py-3 text-center font-medium text-muted">
                <span className="sr-only">Споделяне</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, index) => {
              const cheapestAnnual = filtered[0]?.annualPremium ?? 0;
              const diff = product.annualPremium - cheapestAnnual;

              return (
                <tr
                  key={product.id}
                  className={`border-b border-border last:border-b-0 ${
                    index === 0 ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="h-4 w-4 text-primary" />}
                      <span className="font-medium text-text">{product.insurerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text">{product.productName}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${index === 0 ? "text-primary" : "text-text"}`}>
                      {formatCurrency(product.monthlyPremium)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {index === 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Най-евтин
                      </span>
                    ) : (
                      <span className="text-text">
                        {formatCurrency(product.annualPremium)}{" "}
                        <span className="text-xs text-accent">(+{formatCurrency(diff)})</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.coverage.map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          index === 0
                            ? "bg-primary text-white hover:bg-primary-dark"
                            : "bg-gray-100 text-muted hover:bg-gray-200 hover:text-text"
                        }`}
                      >
                        Към сайта
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleShare(product.id, product.insurerName, product.productName, product.annualPremium)}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-muted transition-colors hover:bg-gray-200 hover:text-text"
                      title="Сподели"
                    >
                      {copiedId === product.id ? (
                        <Check className="h-3 w-3 text-primary" />
                      ) : (
                        <Share2 className="h-3 w-3" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">
        {filtered.length} оферти. Цените са ориентировъчни и зависят от профила на клиента.
      </p>
    </div>
  );
}
