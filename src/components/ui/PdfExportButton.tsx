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

      // Page layout constants (mm)
      const pageW = 210; // A4 width
      const margin = 10;
      const contentW = pageW - margin * 2;
      const headerH = 14;
      const footerH = 10;

      // Scale canvas to fit content width, calculate proportional height
      const scale = contentW / canvas.width;
      const contentH = canvas.height * scale;
      const pageH = margin + headerH + contentH + footerH + margin;

      // Custom-sized page: exact fit, zero slicing
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pageW, pageH],
      });

      const today = new Date().toLocaleDateString("bg-BG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // --- Header ---
      pdf.setFontSize(14);
      pdf.setTextColor(5, 150, 105); // primary green
      pdf.text("Spesti", margin, margin + 6);
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128); // muted gray
      pdf.text(`${title}  |  ${today}`, margin + 24, margin + 6);
      pdf.text("spesti.app", pageW - margin, margin + 6, { align: "right" });

      // separator line
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, margin + headerH - 2, pageW - margin, margin + headerH - 2);

      // --- Content: full image, no slicing ---
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.92),
        "JPEG",
        margin,
        margin + headerH,
        contentW,
        contentH,
      );

      // --- Footer ---
      const footerY = pageH - margin - 2;
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, footerY - 4, pageW - margin, footerY - 4);
      pdf.setFontSize(6);
      pdf.setTextColor(156, 163, 175);
      pdf.text("spesti.app | Informaciyata e s informativna cel.", margin, footerY);
      pdf.text(today, pageW - margin, footerY, { align: "right" });

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
