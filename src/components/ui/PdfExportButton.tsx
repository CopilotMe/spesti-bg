"use client";

import { useState, type RefObject } from "react";
import { Loader2 } from "lucide-react";
import { isProEnabled } from "@/lib/features";

interface PdfExportButtonProps {
  /** Ref to the DOM element that should be captured */
  contentRef: RefObject<HTMLDivElement | null>;
  /** Filename for the downloaded PDF (without .pdf extension) */
  filename: string;
  /** Title shown in the PDF header, e.g. "Заплати в България" */
  title: string;
}

export function PdfExportButton({
  contentRef,
  filename,
  title,
}: PdfExportButtonProps) {
  const [loading, setLoading] = useState(false);

  // Feature gate: render nothing when Pro is off
  if (!isProEnabled()) return null;

  async function handleExport() {
    if (!contentRef.current || loading) return;
    setLoading(true);

    try {
      // Dynamic imports — only loaded on click, zero main-bundle impact
      // html2canvas-pro supports modern CSS colors (lab, oklch) used by Tailwind v4
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const element = contentRef.current;

      // Capture the content area at 2x for crisp output
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 dimensions in mm
      const pdfWidth = 210;
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const headerHeight = 20;
      const footerHeight = 15;

      // Scale image to fit PDF width
      const ratio = contentWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      // Available content area per page
      const pageContentHeight = 297 - margin * 2 - headerHeight - footerHeight;

      const pdf = new jsPDF("portrait", "mm", "a4");
      const today = new Date().toLocaleDateString("bg-BG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let yOffset = 0;
      let pageNum = 0;

      while (yOffset < scaledHeight) {
        if (pageNum > 0) pdf.addPage();

        // --- Header ---
        pdf.setFontSize(16);
        pdf.setTextColor(5, 150, 105); // #059669 primary
        pdf.text("Spesti", margin, margin + 8);
        pdf.setFontSize(9);
        pdf.setTextColor(107, 114, 128); // #6b7280 muted
        pdf.text(`${title}  |  ${today}`, margin + 26, margin + 8);
        pdf.text("spesti.app", pdfWidth - margin - 22, margin + 8);

        // Thin separator line
        pdf.setDrawColor(229, 231, 235);
        pdf.line(
          margin,
          margin + headerHeight - 2,
          pdfWidth - margin,
          margin + headerHeight - 2,
        );

        // --- Content slice ---
        const sliceHeightMm = Math.min(
          pageContentHeight,
          scaledHeight - yOffset,
        );
        const sliceHeightPx = sliceHeightMm / ratio;

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = imgWidth;
        sliceCanvas.height = Math.ceil(sliceHeightPx);
        const ctx = sliceCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            yOffset / ratio,
            imgWidth,
            sliceHeightPx,
            0,
            0,
            imgWidth,
            sliceHeightPx,
          );
        }

        pdf.addImage(
          sliceCanvas.toDataURL("image/png"),
          "PNG",
          margin,
          margin + headerHeight,
          contentWidth,
          sliceHeightMm,
        );

        // --- Footer ---
        const footerY = 297 - margin - 5;
        pdf.setFontSize(7);
        pdf.setTextColor(107, 114, 128);
        pdf.setDrawColor(229, 231, 235);
        pdf.line(margin, footerY - 3, pdfWidth - margin, footerY - 3);
        pdf.text(
          "Informaciyata e s informativna cel. Proverete aktualnite ceni pri vashiya dostavchik. | spesti.app",
          margin,
          footerY,
        );
        pdf.text(`${pageNum + 1}`, pdfWidth - margin - 5, footerY);

        yOffset += sliceHeightMm;
        pageNum++;
      }

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
