"use client";

import { useState, useMemo } from "react";
import { Wifi, Smartphone, Trophy, ExternalLink, Share2, Check } from "lucide-react";
import { filterMobilePlans, filterInternetPlans } from "@/lib/calculators/telecom";
import { formatCurrency } from "@/lib/utils";
import messages from "@/messages/bg.json";

const operatorUrls: Record<string, string> = {
  a1: "https://www.a1.bg",
  vivacom: "https://www.vivacom.bg",
  yettel: "https://www.yettel.bg",
  bulsatcom: "https://www.bulsatcom.bg",
  net1: "http://net1.bg",
  cooolbox: "https://www.cooolbox.bg",
};

type TabType = "mobile" | "internet";

export function TelecomComparison() {
  const t = messages.telecom;

  const [activeTab, setActiveTab] = useState<TabType>("mobile");
  const [planType, setPlanType] = useState<"all" | "prepaid" | "postpaid">("all");
  const [operator, setOperator] = useState<string>("all");
  const [minDataGb, setMinDataGb] = useState(0);
  const [minSpeedMbps, setMinSpeedMbps] = useState(0);
  const [internetProvider, setInternetProvider] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mobilePlansFiltered = useMemo(
    () =>
      filterMobilePlans({
        type: planType,
        minDataGb: minDataGb || undefined,
        operator,
      }),
    [planType, minDataGb, operator]
  );

  const internetPlansFiltered = useMemo(
    () =>
      filterInternetPlans({
        minSpeedMbps: minSpeedMbps || undefined,
        provider: internetProvider,
      }),
    [minSpeedMbps, internetProvider]
  );

  const handleShareMobile = async (planId: string, operatorName: string, planName: string, fee: number) => {
    const text = `${operatorName} ${planName} — ${formatCurrency(fee)}/мес.\n\nВиж сравнението на Спести.бг: ${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Спести.бг", text });
        return;
      } catch { /* cancelled */ }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(planId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* not available */ }
  };

  const handleShareInternet = async (planId: string, providerName: string, planName: string, fee: number, speed: number) => {
    const speedText = speed >= 1000 ? `${speed / 1000} Gbps` : `${speed} Mbps`;
    const text = `${providerName} ${planName} — ${speedText} за ${formatCurrency(fee)}/мес.\n\nВиж сравнението на Спести.бг: ${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Спести.бг", text });
        return;
      } catch { /* cancelled */ }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(planId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* not available */ }
  };

  return (
    <div className="space-y-8">
      {/* Tab switcher */}
      <div className="flex gap-2 rounded-xl border border-border bg-surface p-1">
        <button
          onClick={() => setActiveTab("mobile")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "mobile"
              ? "bg-primary text-white"
              : "text-muted hover:bg-gray-100"
          }`}
        >
          <Smartphone className="h-4 w-4" />
          {t.mobile}
        </button>
        <button
          onClick={() => setActiveTab("internet")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "internet"
              ? "bg-primary text-white"
              : "text-muted hover:bg-gray-100"
          }`}
        >
          <Wifi className="h-4 w-4" />
          {t.homeInternet}
        </button>
      </div>

      {/* Mobile filters */}
      {activeTab === "mobile" && (
        <>
          <div className="grid gap-4 rounded-2xl border border-border bg-surface p-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">
                {t.planType}
              </label>
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value as typeof planType)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value="all">{t.all}</option>
                <option value="prepaid">{t.prepaid}</option>
                <option value="postpaid">{t.postpaid}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">
                {t.operator}
              </label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value="all">{t.allOperators}</option>
                <option value="a1">A1</option>
                <option value="vivacom">Vivacom</option>
                <option value="yettel">Yettel</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">
                {t.minData}
              </label>
              <select
                value={minDataGb}
                onChange={(e) => setMinDataGb(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value={0}>{t.all}</option>
                <option value={5}>5+ GB</option>
                <option value={10}>10+ GB</option>
                <option value={20}>20+ GB</option>
                <option value={50}>50+ GB</option>
                <option value={100}>100+ GB</option>
              </select>
            </div>
          </div>

          {/* Mobile plans table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    {t.operator}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    План
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted">
                    {t.monthlyFee}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted">
                    {t.data}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted">
                    {t.minutes}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted">
                    {t.contract}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    {t.extras}
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
                {mobilePlansFiltered.map((plan, index) => (
                  <tr
                    key={plan.id}
                    className={`border-b border-border last:border-b-0 ${
                      index === 0 ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <Trophy className="h-4 w-4 text-primary" />
                        )}
                        <span className="font-medium text-text">
                          {plan.operatorName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text">{plan.planName}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-semibold ${
                          index === 0 ? "text-primary" : "text-text"
                        }`}
                      >
                        {formatCurrency(plan.monthlyFee)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-text">
                      {plan.dataGb} GB
                    </td>
                    <td className="px-4 py-3 text-right text-text">
                      {plan.minutes === "unlimited" ? t.unlimited : plan.minutes}
                    </td>
                    <td className="px-4 py-3 text-right text-text">
                      {plan.contractMonths
                        ? `${plan.contractMonths} ${t.months}`
                        : t.noContract}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {plan.extras.map((extra) => (
                          <span
                            key={extra}
                            className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary"
                          >
                            {extra}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={operatorUrls[plan.operator] || "#"}
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
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleShareMobile(plan.id, plan.operatorName, plan.planName, plan.monthlyFee)}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-muted transition-colors hover:bg-gray-200 hover:text-text"
                        title="Сподели този план"
                      >
                        {copiedId === plan.id ? (
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
          <p className="text-xs text-muted">
            {mobilePlansFiltered.length} плана намерени. Сортирани по месечна
            такса (от най-евтин).
          </p>
        </>
      )}

      {/* Internet filters and table */}
      {activeTab === "internet" && (
        <>
          <div className="grid gap-4 rounded-2xl border border-border bg-surface p-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">
                Доставчик
              </label>
              <select
                value={internetProvider}
                onChange={(e) => setInternetProvider(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value="all">{t.allProviders}</option>
                <option value="a1">A1</option>
                <option value="vivacom">Vivacom</option>
                <option value="bulsatcom">Bulsatcom</option>
                <option value="net1">Net1</option>
                <option value="cooolbox">Cooolbox</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">
                {t.minSpeed}
              </label>
              <select
                value={minSpeedMbps}
                onChange={(e) => setMinSpeedMbps(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value={0}>{t.all}</option>
                <option value={100}>100+ Mbps</option>
                <option value={200}>200+ Mbps</option>
                <option value={500}>500+ Mbps</option>
                <option value={1000}>1 Gbps</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Доставчик
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    План
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted">
                    {t.speed}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted">
                    {t.monthlyFee}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    {t.technology}
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
                {internetPlansFiltered.map((plan, index) => (
                  <tr
                    key={plan.id}
                    className={`border-b border-border last:border-b-0 ${
                      index === 0 ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <Trophy className="h-4 w-4 text-primary" />
                        )}
                        <span className="font-medium text-text">
                          {plan.providerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text">{plan.planName}</td>
                    <td className="px-4 py-3 text-right text-text">
                      {plan.speedMbps >= 1000
                        ? `${plan.speedMbps / 1000} Gbps`
                        : `${plan.speedMbps} Mbps`}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-semibold ${
                          index === 0 ? "text-primary" : "text-text"
                        }`}
                      >
                        {formatCurrency(plan.monthlyFee)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-muted">
                        {plan.technology}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={operatorUrls[plan.provider] || "#"}
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
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleShareInternet(plan.id, plan.providerName, plan.planName, plan.monthlyFee, plan.speedMbps)}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-muted transition-colors hover:bg-gray-200 hover:text-text"
                        title="Сподели този план"
                      >
                        {copiedId === plan.id ? (
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
          <p className="text-xs text-muted">
            {internetPlansFiltered.length} плана намерени. Сортирани по месечна
            такса (от най-евтин).
          </p>
        </>
      )}
    </div>
  );
}
