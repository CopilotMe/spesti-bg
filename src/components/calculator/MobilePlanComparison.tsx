"use client";

import { useState, useMemo } from "react";
import { Trophy, ExternalLink, Smartphone, Info } from "lucide-react";
import { filterMobilePlans } from "@/lib/calculators/telecom";
import { mobilePlans } from "@/data/telecom";

const DATA_OPTIONS = [
  { label: "Всички", value: 0 },
  { label: "5+ GB", value: 5 },
  { label: "10+ GB", value: 10 },
  { label: "20+ GB", value: 20 },
  { label: "50+ GB", value: 50 },
];

const OPERATORS = [
  { label: "Всички", value: "all" },
  { label: "A1", value: "a1" },
  { label: "Vivacom", value: "vivacom" },
  { label: "Yettel", value: "yettel" },
];

const TYPES = [
  { label: "Всички", value: "all" as const },
  { label: "Предплатен", value: "prepaid" as const },
  { label: "Абонамент", value: "postpaid" as const },
];

const OPERATOR_COLORS: Record<string, string> = {
  a1: "text-red-600",
  vivacom: "text-purple-600",
  yettel: "text-green-600",
};

export function MobilePlanComparison() {
  const [type, setType] = useState<"all" | "prepaid" | "postpaid">("all");
  const [minGb, setMinGb] = useState(0);
  const [operator, setOperator] = useState("all");

  const filtered = useMemo(
    () =>
      filterMobilePlans({
        type: type === "all" ? "all" : type,
        minDataGb: minGb || undefined,
        operator,
      }),
    [type, minGb, operator],
  );

  /* ---------- operator summary ---------- */
  const operatorStats = useMemo(() => {
    const stats: Record<
      string,
      { name: string; count: number; min: number; max: number; total: number }
    > = {};
    mobilePlans.forEach((p) => {
      if (!stats[p.operator]) {
        stats[p.operator] = {
          name: p.operatorName,
          count: 0,
          min: Infinity,
          max: -Infinity,
          total: 0,
        };
      }
      const s = stats[p.operator];
      s.count++;
      s.min = Math.min(s.min, p.monthlyFee);
      s.max = Math.max(s.max, p.monthlyFee);
      s.total += p.monthlyFee;
    });
    return Object.entries(stats).map(([id, s]) => ({
      id,
      ...s,
      avg: s.total / s.count,
    }));
  }, []);

  const cheapest = filtered[0];
  const mostExpensive = filtered[filtered.length - 1];
  const yearlySaving =
    cheapest && mostExpensive
      ? (mostExpensive.monthlyFee - cheapest.monthlyFee) * 12
      : 0;

  return (
    <div className="space-y-8">
      {/* ---- Filters ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Type */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted">
              Тип план
            </label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    type === t.value
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-text hover:bg-primary/5"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min GB */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted">
              Минимум данни
            </label>
            <div className="flex flex-wrap gap-2">
              {DATA_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setMinGb(d.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    minGb === d.value
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-text hover:bg-primary/5"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Operator */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted">
              Оператор
            </label>
            <div className="flex flex-wrap gap-2">
              {OPERATORS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setOperator(o.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    operator === o.value
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-text hover:bg-primary/5"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Summary cards ---- */}
      {cheapest && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
            <Trophy className="mx-auto mb-1 h-5 w-5 text-primary" />
            <div className="text-lg font-bold text-primary">
              {cheapest.monthlyFee.toFixed(2)} &euro;/мес
            </div>
            <div className="text-xs text-muted">
              Най-евтин: {cheapest.operatorName} {cheapest.planName}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <Smartphone className="mx-auto mb-1 h-5 w-5 text-muted" />
            <div className="text-lg font-bold text-text">
              {filtered.length}
            </div>
            <div className="text-xs text-muted">намерени плана</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <div className="text-lg font-bold text-green-600">
              {yearlySaving.toFixed(0)} &euro;/год
            </div>
            <div className="text-xs text-muted">
              разлика между най-евтин и най-скъп
            </div>
          </div>
        </div>
      )}

      {/* ---- Results table ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-muted">
            Няма планове, отговарящи на филтрите. Пробвай с по-малко ограничения.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="pb-2 pr-3 font-medium">#</th>
                  <th className="pb-2 pr-3 font-medium">Оператор</th>
                  <th className="pb-2 pr-3 font-medium">План</th>
                  <th className="pb-2 pr-3 font-medium text-right">
                    Цена/мес
                  </th>
                  <th className="pb-2 pr-3 font-medium text-right">GB</th>
                  <th className="pb-2 pr-3 font-medium text-right">Минути</th>
                  <th className="pb-2 pr-3 font-medium">Тип</th>
                  <th className="pb-2 font-medium">Екстри</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((plan, i) => (
                  <tr
                    key={plan.id}
                    className={`border-b border-border/50 last:border-0 ${
                      i === 0 ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="py-2.5 pr-3">
                      {i === 0 ? (
                        <Trophy className="h-4 w-4 text-primary" />
                      ) : (
                        <span className="text-muted">{i + 1}</span>
                      )}
                    </td>
                    <td
                      className={`py-2.5 pr-3 font-medium ${OPERATOR_COLORS[plan.operator] || "text-text"}`}
                    >
                      {plan.operatorName}
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-text">
                      {plan.planName}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-bold text-text">
                      {plan.monthlyFee.toFixed(2)} &euro;
                    </td>
                    <td className="py-2.5 pr-3 text-right text-text">
                      {plan.dataGb} GB
                    </td>
                    <td className="py-2.5 pr-3 text-right text-text">
                      {plan.minutes === "unlimited" ? "Неогр." : plan.minutes}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          plan.type === "prepaid"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {plan.type === "prepaid" ? "Предпл." : "Абон."}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {plan.extras.map((e) => (
                          <span
                            key={e}
                            className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-muted"
                          >
                            {e}
                          </span>
                        ))}
                        {plan.contractMonths && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                            {plan.contractMonths} мес.
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---- Operator comparison ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold text-text">
          Сравнение по оператор
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {operatorStats.map((op) => (
            <div
              key={op.id}
              className="rounded-xl border border-border bg-white p-4"
            >
              <h3
                className={`mb-2 text-lg font-bold ${OPERATOR_COLORS[op.id] || "text-text"}`}
              >
                {op.name}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Планове:</span>
                  <span className="font-medium text-text">{op.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">От:</span>
                  <span className="font-medium text-text">
                    {op.min.toFixed(2)} &euro;/мес
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">До:</span>
                  <span className="font-medium text-text">
                    {op.max.toFixed(2)} &euro;/мес
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Средна:</span>
                  <span className="font-medium text-text">
                    {op.avg.toFixed(2)} &euro;/мес
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Tips ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-2 text-sm text-muted">
            <h3 className="font-semibold text-text">
              Как да избереш мобилен план?
            </h3>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Предплатен</strong> — без договор, по-ниска цена, идеален
                ако харчиш малко данни или искаш гъвкавост.
              </li>
              <li>
                <strong>Абонамент</strong> — по-голям пакет данни и минути, но
                обвързан с 24-месечен договор. Внимавай с неустойки при
                прекратяване.
              </li>
              <li>
                <strong>Цена за GB</strong> — по-скъпите планове обикновено
                предлагат по-ниска цена за GB. Сметни колко данни реално
                използваш.
              </li>
              <li>
                <strong>5G</strong> — ако телефонът ти поддържа 5G, виж кои
                планове го включват (обикновено абонаментните).
              </li>
              <li>
                <strong>EU Roaming</strong> — всички оператори предлагат
                безплатен роуминг в ЕС, но пакетите данни в роуминг може да
                са по-малки.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
