import { jsPDF } from "jspdf";

/**
 * Converts a generated Markdown string (e.g., CV or Cover Letter) into a beautifully formatted,
 * print-ready PDF using the jsPDF library. Supports inline bold formatting, headings, bullet points,
 * numbered lists, horizontal rules, and automatic pagination.
 */
export function generatePdfFromMarkdown(
  title: string,
  markdownText: string,
  filename: string,
  candidateName?: string,
  targetCountry?: string
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 20;
  const maxLineWidth = pageWidth - (marginX * 2); // 170mm
  const startY = 25;
  let currentY = startY;
  const maxY = pageHeight - 25; // 25mm margin at the bottom for footer

  // Draw Header and Border Frame on a page
  const drawPageDecorations = (pageNumber: number) => {
    // Subtle top accent bar (BIPLOB Gold)
    doc.setFillColor(184, 134, 11); // #B8860B
    doc.rect(0, 0, pageWidth, 4, "F");

    // Top logo/header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("BIPLOB SKILLS ACADEMY  |  OVERSEAS CAREER PLATFORM", marginX, 12);
    doc.setFont("helvetica", "normal");
    doc.text("VERIFIED TALENT REGISTRY", pageWidth - marginX - 45, 12);

    // Subtle line below header
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(marginX, 15, pageWidth - marginX, 15);

    // Footer
    doc.setDrawColor(220, 220, 220);
    doc.line(marginX, pageHeight - 15, pageWidth - marginX, pageHeight - 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated via AI Resume Compiler", marginX, pageHeight - 10);
    doc.text(`Page ${pageNumber}`, pageWidth - marginX - 15, pageHeight - 10);
  };

  // Split lines
  const lines = markdownText.split("\n");

  // Document Title inside page
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(17, 17, 17); // #111111
  
  // Render document title
  currentY = 28;
  doc.text(title.toUpperCase(), marginX, currentY);
  currentY += 6;

  if (candidateName) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Prepared for: ${candidateName} ${targetCountry ? ` |  Target Country: ${targetCountry}` : ""}`, 
      marginX, 
      currentY
    );
    currentY += 8;
  } else {
    currentY += 4;
  }

  // Draw separator line under title
  doc.setDrawColor(184, 134, 11); // BIPLOB Gold
  doc.setLineWidth(1.0);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 10;

  // Track page count
  let pageNumber = 1;

  // Draw page 1 decorations
  drawPageDecorations(pageNumber);

  // Function to handle automatic pagination
  const checkPageSpace = (neededHeight: number) => {
    if (currentY + neededHeight > maxY) {
      doc.addPage();
      pageNumber++;
      currentY = startY + 10; // offset slightly down on subsequent pages
      drawPageDecorations(pageNumber);
    }
  };

  // Helper to render text supporting inline markdown bolding (**text**)
  const renderTextWithInlineBold = (text: string, x: number, y: number) => {
    if (text.includes("**")) {
      const parts = text.split("**");
      let currentX = x;
      for (let k = 0; k < parts.length; k++) {
        const isBold = k % 2 === 1;
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(isBold ? 17 : 40, isBold ? 17 : 40, isBold ? 17 : 40);
        
        doc.text(parts[k], currentX, y);
        currentX += doc.getTextWidth(parts[k]);
      }
    } else {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.text(text, x, y);
    }
  };

  // Parse lines of Markdown
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines, but add a small vertical spacer
    if (line === "") {
      currentY += 3.5;
      continue;
    }

    // Check for dividers
    if (line === "---" || line === "___" || line.startsWith("***")) {
      checkPageSpace(6);
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(marginX, currentY, pageWidth - marginX, currentY);
      currentY += 6;
      continue;
    }

    // Header 1: # Heading
    if (line.startsWith("# ")) {
      const headingText = line.replace("# ", "").trim();
      checkPageSpace(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(184, 134, 11); // Gold accents for main subheadings
      doc.text(headingText, marginX, currentY);
      currentY += 7;
      continue;
    }

    // Header 2: ## Heading
    if (line.startsWith("## ")) {
      const headingText = line.replace("## ", "").trim();
      checkPageSpace(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      doc.setTextColor(17, 17, 17);
      doc.text(headingText, marginX, currentY);
      currentY += 6;
      continue;
    }

    // Header 3: ### Heading
    if (line.startsWith("### ")) {
      const headingText = line.replace("### ", "").trim();
      checkPageSpace(9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(60, 60, 60);
      doc.text(headingText, marginX, currentY);
      currentY += 5.5;
      continue;
    }

    // Bullet point list item: - Item or * Item
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const bulletText = line.substring(2).trim();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);

      // Split bullet text to support multi-line wrap
      const wrappedLines: string[] = doc.splitTextToSize(bulletText, maxLineWidth - 6);
      
      for (let j = 0; j < wrappedLines.length; j++) {
        checkPageSpace(5.5);
        if (j === 0) {
          // Draw a small bullet circle or square
          doc.setFillColor(184, 134, 11);
          doc.rect(marginX + 1, currentY - 2.5, 1.5, 1.5, "F");
          renderTextWithInlineBold(wrappedLines[j], marginX + 6, currentY);
        } else {
          renderTextWithInlineBold(wrappedLines[j], marginX + 6, currentY);
        }
        currentY += 5.5;
      }
      continue;
    }

    // Numbered list item: 1. Item
    const numberedMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const numText = numberedMatch[2];
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);

      const wrappedLines: string[] = doc.splitTextToSize(numText, maxLineWidth - 8);
      for (let j = 0; j < wrappedLines.length; j++) {
        checkPageSpace(5.5);
        if (j === 0) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(40, 40, 40);
          doc.text(`${num}.`, marginX, currentY);
          renderTextWithInlineBold(wrappedLines[j], marginX + 6, currentY);
        } else {
          renderTextWithInlineBold(wrappedLines[j], marginX + 6, currentY);
        }
        currentY += 5.5;
      }
      continue;
    }

    // Paragraph with potential inline bold text (e.g., **Contact:** Nazmul)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);

    const wrappedLines: string[] = doc.splitTextToSize(line, maxLineWidth);
    for (let j = 0; j < wrappedLines.length; j++) {
      checkPageSpace(5.5);
      renderTextWithInlineBold(wrappedLines[j], marginX, currentY);
      currentY += 5.5;
    }
  }

  // Save PDF file
  doc.save(filename);
}
