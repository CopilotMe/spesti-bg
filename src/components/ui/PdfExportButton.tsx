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
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const headerH = 16;
      const footerH = 12;

      // Scale factor: image pixels → mm
      const scale = contentWidth / imgWidth;
      const totalContentMm = imgHeight * scale;

      // Available content height per page
      const availableH = pageHeight - margin * 2 - headerH - footerH;

      const totalPages = Math.max(1, Math.ceil(totalContentMm / availableH));

      const pdf = new jsPDF("portrait", "mm", "a4");
      const today = new Date().toLocaleDateString("bg-BG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        // --- Header ---
        pdf.setFontSize(14);
        pdf.setTextColor(5, 150, 105); // #059669 primary
        pdf.text("Spesti", margin, margin + 6);
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128); // #6b7280 muted
        pdf.text(`${title}  |  ${today}`, margin + 24, margin + 6);
        pdf.text("spesti.app", pdfWidth - margin, margin + 6, {
          align: "right",
        });

        // Thin separator
        pdf.setDrawColor(229, 231, 235);
        pdf.line(margin, margin + headerH - 2, pdfWidth - margin, margin + headerH - 2);

        // --- Content slice ---
        // Calculate which portion of the source canvas to draw on this page
        const srcYPx = (page * availableH) / scale;
        const srcHPx = Math.min(availableH / scale, imgHeight - srcYPx);
        const destHMm = srcHPx * scale;

        if (srcHPx <= 0) break;

        // Create a slice canvas for this page
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = imgWidth;
        sliceCanvas.height = Math.ceil(srcHPx);
        const ctx = sliceCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, Math.floor(srcYPx), imgWidth, Math.ceil(srcHPx),
            0, 0, imgWidth, Math.ceil(srcHPx),
          );
        }

        pdf.addImage(
          sliceCanvas.toDataURL("image/jpeg", 0.92),
          "JPEG",
          margin,
          margin + headerH,
          contentWidth,
          destHMm,
        );

        // --- Footer ---
        const footerY = pageHeight - margin - 3;
        pdf.setFontSize(6);
        pdf.setTextColor(156, 163, 175);
        pdf.setDrawColor(229, 231, 235);
        pdf.line(margin, footerY - 4, pdfWidth - margin, footerY - 4);
        pdf.text(
          "spesti.app | Informaciyata e s informativna cel.",
          margin,
          footerY,
        );
        pdf.text(
          `${page + 1} / ${totalPages}`,
          pdfWidth - margin,
          footerY,
          { align: "right" },
        );
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
