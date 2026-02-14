"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { explanations } from "@/data/explanations";

interface TooltipProps {
  explanationKey: string;
}

export function ExplainTooltip({ explanationKey }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const explanation = explanations[explanationKey];

  if (!explanation) return null;

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 inline-flex items-center gap-0.5 rounded-full text-xs text-secondary hover:text-secondary-light"
        aria-label={`Обясни: ${explanation.term}`}
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-xl border border-border bg-surface p-4 shadow-lg">
            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-primary">
                {explanation.term}
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs leading-relaxed text-text">
              {explanation.simple}
            </p>
          </div>
        </>
      )}
    </span>
  );
}
