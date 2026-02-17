"use client";

import { useState, useMemo } from "react";
import { Landmark, TrendingDown, Trophy, ExternalLink, Share2, Check } from "lucide-react";
import { calculateLoans } from "@/lib/calculators/loans";
import { formatCurrency } from "@/lib/utils";
import { refUrl } from "@/lib/ref";
import { LoanInput } from "@/lib/types";

export function LoanCalculator() {
  const [loanType, setLoanType] = useState<"consumer" | "mortgage">("consumer");
  const [amount, setAmount] = useState(5000);
  const [termMonths, setTermMonths] = useState(60);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const input: LoanInput = { amount, termMonths, type: loanType };
  const results = useMemo(() => calculateLoans(input), [amount, termMonths, loanType]);

  const handleShare = async (bankName: string, monthly: number, total: number, id: string) => {
    const text = `${bankName} — ${formatCurrency(monthly)}/мес., общо ${formatCurrency(total)} за кредит от ${formatCurrency(amount)} за ${termMonths} мес.\n\nВиж сравнението на Спести: ${window.location.href}`;
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
          <Landmark className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-text">Кредитен калкулатор</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Loan type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Тип кредит</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setLoanType("consumer"); setAmount(5000); setTermMonths(60); }}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  loanType === "consumer"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-muted hover:bg-gray-200"
                }`}
              >
                Потребителски
              </button>
              <button
                onClick={() => { setLoanType("mortgage"); setAmount(50000); setTermMonths(240); }}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  loanType === "mortgage"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-muted hover:bg-gray-200"
                }`}
              >
                Жилищен
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="loan-amount" className="text-sm font-medium text-text">
              Сума ({loanType === "consumer" ? "250 - 40 000" : "5 000 - 255 000"} €)
            </label>
            <input
              id="loan-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={loanType === "consumer" ? 250 : 5000}
              max={loanType === "consumer" ? 40000 : 255000}
              step={loanType === "consumer" ? 250 : 5000}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="range"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={loanType === "consumer" ? 250 : 5000}
              max={loanType === "consumer" ? 40000 : 255000}
              step={loanType === "consumer" ? 250 : 5000}
              className="w-full accent-primary"
              aria-label="Сума на кредита"
            />
          </div>

          {/* Term */}
          <div className="space-y-2">
            <label htmlFor="loan-term" className="text-sm font-medium text-text">
              Срок ({termMonths} месеца = {Math.round(termMonths / 12)} год.)
            </label>
            <input
              id="loan-term"
              type="number"
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              min={6}
              max={loanType === "consumer" ? 120 : 420}
              step={6}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="range"
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              min={6}
              max={loanType === "consumer" ? 120 : 420}
              step={6}
              className="w-full accent-primary"
              aria-label="Срок на кредита"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      {results.length > 0 && results[0] && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted">Най-ниска вноска</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(results[0].monthlyPayment)}</p>
            <p className="text-xs text-muted">/месец</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-xs text-muted">Общо връщаш</p>
            <p className="text-2xl font-bold text-text">{formatCurrency(results[0].totalPayment)}</p>
            <p className="text-xs text-muted">за {termMonths} мес.</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-xs text-muted">Общо лихва</p>
            <p className="text-2xl font-bold text-accent">{formatCurrency(results[0].totalInterest)}</p>
            <p className="text-xs text-muted">
              <TrendingDown className="mr-1 inline h-3 w-3" />
              при най-евтиния
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-muted">Банка</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Продукт</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Лихва</th>
                <th className="px-4 py-3 text-right font-medium text-muted">ГПР</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Вноска</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Общо лихва</th>
                <th className="px-4 py-3 text-center font-medium text-muted">Оферта</th>
                <th className="px-4 py-3 text-center font-medium text-muted">
                  <span className="sr-only">Споделяне</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr
                  key={r.product.id}
                  className={`border-b border-border last:border-b-0 ${
                    r.isCheapest ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.isCheapest && <Trophy className="h-4 w-4 text-primary" />}
                      <span className="font-medium text-text">{r.product.bankName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text">{r.product.productName}</td>
                  <td className="px-4 py-3 text-right text-text">{r.product.interestRate}%</td>
                  <td className="px-4 py-3 text-right text-text">{r.product.apr}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${r.isCheapest ? "text-primary" : "text-text"}`}>
                      {formatCurrency(r.monthlyPayment)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.isCheapest ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Най-евтин
                      </span>
                    ) : (
                      <span className="text-xs text-accent">
                        +{formatCurrency(r.differenceFromCheapest)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.product.url && (
                      <a
                        href={refUrl(r.product.url, "loans")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          r.isCheapest
                            ? "bg-primary text-white hover:bg-primary-dark"
                            : "bg-gray-100 text-muted hover:bg-gray-200 hover:text-text"
                        }`}
                      >
                        Виж оферта
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleShare(r.product.bankName, r.monthlyPayment, r.totalPayment, r.product.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-muted transition-colors hover:bg-gray-200 hover:text-text"
                      title="Сподели"
                    >
                      {copiedId === r.product.id ? (
                        <>
                          <Check className="h-3 w-3 text-primary" />
                          <span className="text-primary">Копирано</span>
                        </>
                      ) : (
                        <Share2 className="h-3 w-3" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
          Няма подходящи оферти за тези параметри. Опитай с друга сума или срок.
        </div>
      )}
    </div>
  );
}
