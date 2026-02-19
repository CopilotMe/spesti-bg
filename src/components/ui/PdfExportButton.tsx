"use client";

import { useState, useEffect, type RefObject } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { isProEnabled, PRO_PRICE } from "@/lib/features";

/* ------------------------------------------------------------------ */
/*  Layout constants (mm) — standard A4                                */
/* ------------------------------------------------------------------ */
const A4_W = 210;
const A4_H = 297;
const MARGIN = 12;
const CONTENT_W = A4_W - MARGIN * 2; // 186 mm
const HEADER_H = 14;
const FOOTER_H = 10;
const USABLE_H = A4_H - MARGIN * 2 - HEADER_H - FOOTER_H; // ~249 mm
const GAP = 4; // vertical gap between sections on same page
const SCALE = 1.5; // html2canvas resolution multiplier

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Crop a horizontal strip from a source canvas */
function cropCanvas(
  source: HTMLCanvasElement,
  sy: number,
  sh: number,
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = source.width;
  c.height = Math.max(1, Math.round(sh));
  const ctx = c.getContext("2d")!;
  ctx.drawImage(source, 0, sy, source.width, sh, 0, 0, c.width, c.height);
  return c;
}

type PDF = import("jspdf").jsPDF;

function drawHeader(pdf: PDF, pageNum: number) {
  pdf.setFontSize(14);
  pdf.setTextColor(5, 150, 105);
  pdf.text("Spesti", MARGIN, MARGIN + 6);
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text("spesti.app", A4_W - MARGIN, MARGIN + 6, { align: "right" });
  if (pageNum > 1) {
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(`${pageNum}`, MARGIN + 24, MARGIN + 6);
  }
  pdf.setDrawColor(229, 231, 235);
  pdf.line(MARGIN, MARGIN + HEADER_H - 2, A4_W - MARGIN, MARGIN + HEADER_H - 2);
}

function drawFooter(pdf: PDF, pageNum: number) {
  const y = A4_H - MARGIN - 2;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(MARGIN, y - 4, A4_W - MARGIN, y - 4);
  pdf.setFontSize(6);
  pdf.setTextColor(156, 163, 175);
  pdf.text("spesti.app", MARGIN, y);
  pdf.text(`${pageNum}`, A4_W - MARGIN, y, { align: "right" });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface PdfExportButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
  filename: string;
  title: string;
}

export function PdfExportButton({
  contentRef,
  filename,
}: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Check Pro status on mount (localStorage is client-only)
  useEffect(() => {
    setIsPro(isProEnabled());
  }, []);

  // Not Pro → hide completely (no CTA until payment provider is set up)
  if (!isPro) {
    return null;
  }

  async function handleExport() {
    if (!contentRef.current || loading) return;
    setLoading(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const container = contentRef.current;

      // Collect sections marked with data-pdf-section
      const sectionEls = Array.from(
        container.querySelectorAll<HTMLElement>("[data-pdf-section]"),
      );
      // Fallback: if no sections marked, treat entire container as one
      if (sectionEls.length === 0) sectionEls.push(container);

      // Render each section to canvas sequentially (avoid memory spikes)
      const rendered: { canvas: HTMLCanvasElement; hMM: number }[] = [];
      for (const el of sectionEls) {
        const canvas = await html2canvas(el, {
          scale: SCALE,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          onclone: (_doc: Document, clonedEl: HTMLElement) => {
            // html2canvas can't render native <input> widgets properly.
            // Replace number inputs with styled <span> showing the value,
            // and hide range sliders entirely (interactive-only, no PDF value).
            clonedEl
              .querySelectorAll<HTMLInputElement>("input[type=number]")
              .forEach((inp) => {
                const span = _doc.createElement("span");
                span.textContent = inp.value;
                span.style.display = "block";
                span.style.padding = "4px 8px";
                span.style.fontSize = "14px";
                span.style.fontWeight = "600";
                span.style.color = "#1f2937";
                span.style.border = "1px solid #e5e7eb";
                span.style.borderRadius = "6px";
                span.style.backgroundColor = "#ffffff";
                span.style.lineHeight = "1.5";
                inp.replaceWith(span);
              });
            clonedEl
              .querySelectorAll<HTMLInputElement>("input[type=range]")
              .forEach((inp) => {
                inp.style.display = "none";
              });
          },
        });
        const hMM = (canvas.height / canvas.width) * CONTENT_W;
        rendered.push({ canvas, hMM });
      }

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      let pageNum = 1;
      let curY = 0; // current Y within usable area

      drawHeader(pdf, pageNum);

      for (const { canvas, hMM } of rendered) {
        if (hMM <= USABLE_H) {
          // --- Normal section: fits on one page ---
          if (curY + hMM > USABLE_H) {
            // Doesn't fit on current page → new page
            drawFooter(pdf, pageNum);
            pdf.addPage();
            pageNum++;
            curY = 0;
            drawHeader(pdf, pageNum);
          }

          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            MARGIN,
            MARGIN + HEADER_H + curY,
            CONTENT_W,
            hMM,
          );
          curY += hMM + GAP;
        } else {
          // --- Oversized section: split across pages ---
          const pxPerMM = canvas.width / CONTENT_W;
          let offsetPx = 0;
          let remainPx = canvas.height;

          // First slice: fill remaining space on current page
          const availMM = USABLE_H - curY;
          const firstPx = Math.min(Math.round(availMM * pxPerMM), remainPx);
          if (firstPx > 0) {
            const slice = cropCanvas(canvas, 0, firstPx);
            const sliceMM = firstPx / pxPerMM;
            pdf.addImage(
              slice.toDataURL("image/png"),
              "PNG",
              MARGIN,
              MARGIN + HEADER_H + curY,
              CONTENT_W,
              sliceMM,
            );
            offsetPx += firstPx;
            remainPx -= firstPx;
          }

          // Subsequent full-page slices
          while (remainPx > 0) {
            drawFooter(pdf, pageNum);
            pdf.addPage();
            pageNum++;
            drawHeader(pdf, pageNum);

            const slicePx = Math.min(
              Math.round(USABLE_H * pxPerMM),
              remainPx,
            );
            const slice = cropCanvas(canvas, offsetPx, slicePx);
            const sliceMM = slicePx / pxPerMM;
            pdf.addImage(
              slice.toDataURL("image/png"),
              "PNG",
              MARGIN,
              MARGIN + HEADER_H,
              CONTENT_W,
              sliceMM,
            );
            offsetPx += slicePx;
            remainPx -= slicePx;
          }
          curY = 0; // reset after oversized section
        }
      }

      // Footer on last page
      drawFooter(pdf, pageNum);

      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Генериране...
        </>
      ) : (
        <>
          <span>📄</span>
          Изтегли PDF
        </>
      )}
    </button>
  );
}
