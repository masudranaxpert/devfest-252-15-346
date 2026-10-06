import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { TenderDetails, EvaluatedRequirement } from '../types/index.ts';

export interface GeneratePackageOptions {
  tender: TenderDetails;
  evaluatedRequirements: EvaluatedRequirement[];
  includeIndexPage?: boolean;
}

/**
 * Replaces any character Helvetica / WinAnsi cannot encode with '?'.
 * Helvetica standard font supports ASCII 32-126 and standard WinAnsi Latin-1 extension chars.
 */
export function safeText(input: string | undefined | null): string {
  if (!input) return '';
  return input.replace(
    /[^\x20-\x7E\xA0-\xFF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178]/g,
    '?'
  );
}

/**
 * Generates the unified tender submission package adhering to Section 6.
 */
export async function generateTenderPackage(
  options: GeneratePackageOptions
): Promise<Uint8Array> {
  const { tender, evaluatedRequirements } = options;

  // Filter only matched requirements and ensure sorted by order ascending
  const includedDocs = evaluatedRequirements
    .filter(item => item.matchedFile !== null)
    .sort((a, b) => a.requirement.order - b.requirement.order);

  // 1. Create main output PDF
  const mergedPdf = await PDFDocument.create();
  const [fontHelvetica, fontHelveticaBold] = await Promise.all([
    mergedPdf.embedFont(StandardFonts.Helvetica),
    mergedPdf.embedFont(StandardFonts.HelveticaBold),
  ]);

  // 2. Build Cover Page (A4: 595.28 x 841.89 points)
  const coverPage = mergedPdf.addPage([595.28, 841.89]);
  const { width: pageWidth, height: pageHeight } = coverPage.getSize();

  // Draw header accent banner
  coverPage.drawRectangle({
    x: 40,
    y: pageHeight - 90,
    width: pageWidth - 80,
    height: 50,
    color: rgb(0.12, 0.23, 0.37), // Navy blue
  });

  coverPage.drawText('TENDER SUBMISSION PACKAGE', {
    x: 55,
    y: pageHeight - 65,
    size: 16,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  coverPage.drawText('TENDER SUBMISSION DOCUMENTS', {
    x: 55,
    y: pageHeight - 80,
    size: 9,
    font: fontHelvetica,
    color: rgb(0.85, 0.9, 0.98),
  });

  // Tender Metadata Section
  let curY = pageHeight - 120;
  const drawMetaRow = (label: string, value: string) => {
    coverPage.drawText(label.toUpperCase(), {
      x: 45,
      y: curY,
      size: 8,
      font: fontHelveticaBold,
      color: rgb(0.35, 0.4, 0.45),
    });
    coverPage.drawText(safeText(value) || 'N/A', {
      x: 180,
      y: curY,
      size: 10,
      font: fontHelvetica,
      color: rgb(0.1, 0.1, 0.1),
    });
    curY -= 20;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  drawMetaRow('Tender ID:', safeText(tender.tender_id));
  drawMetaRow('Tender Title:', safeText(tender.title));
  drawMetaRow('Procuring Entity:', safeText(tender.procuring_entity));
  drawMetaRow('Bidder Name:', safeText(tender.bidder));
  drawMetaRow('Submission Deadline:', safeText(tender.submission_deadline));
  drawMetaRow('Package Created Date:', safeText(todayStr));

  curY -= 15;
  coverPage.drawLine({
    start: { x: 40, y: curY },
    end: { x: pageWidth - 40, y: curY },
    thickness: 1,
    color: rgb(0.8, 0.85, 0.9),
  });

  curY -= 25;
  coverPage.drawText('INCLUDED DOCUMENTS SCHEDULE', {
    x: 45,
    y: curY,
    size: 12,
    font: fontHelveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  });

  curY -= 20;

  // Table header
  coverPage.drawRectangle({
    x: 40,
    y: curY - 5,
    width: pageWidth - 80,
    height: 22,
    color: rgb(0.93, 0.95, 0.98),
  });

  coverPage.drawText('Seq', { x: 48, y: curY, size: 8, font: fontHelveticaBold, color: rgb(0.2, 0.2, 0.2) });
  coverPage.drawText('Document Title', { x: 75, y: curY, size: 8, font: fontHelveticaBold, color: rgb(0.2, 0.2, 0.2) });
  coverPage.drawText('File Attached', { x: 260, y: curY, size: 8, font: fontHelveticaBold, color: rgb(0.2, 0.2, 0.2) });
  coverPage.drawText('Validity / Status', { x: 430, y: curY, size: 8, font: fontHelveticaBold, color: rgb(0.2, 0.2, 0.2) });
  coverPage.drawText('Pages', { x: 520, y: curY, size: 8, font: fontHelveticaBold, color: rgb(0.2, 0.2, 0.2) });

  curY -= 20;

  // Table rows
  includedDocs.forEach((item, idx) => {
    if (curY < 60) return; // Guard against table overflow
    const orderLabel = safeText(`${item.requirement.order}`);
    const rawTitle = item.requirement.title_en.length > 32 
      ? item.requirement.title_en.slice(0, 30) + '...' 
      : item.requirement.title_en;
    const title = safeText(rawTitle);
    const rawFileName = item.matchedFile 
      ? (item.matchedFile.name.length > 25 ? item.matchedFile.name.slice(0, 23) + '...' : item.matchedFile.name)
      : 'None';
    const fileName = safeText(rawFileName);
    const rawValidityText = item.requirement.has_expiry && item.expiryDate 
      ? `Exp: ${item.expiryDate}` 
      : (item.status === 'OK' ? 'Verified OK' : item.status);
    const validityText = safeText(rawValidityText);
    const pagesText = safeText(item.matchedFile ? `${item.matchedFile.pageCount}` : '0');

    if (idx % 2 === 1) {
      coverPage.drawRectangle({
        x: 40,
        y: curY - 4,
        width: pageWidth - 80,
        height: 18,
        color: rgb(0.97, 0.98, 1.0),
      });
    }

    coverPage.drawText(orderLabel, { x: 50, y: curY, size: 8, font: fontHelvetica, color: rgb(0.2, 0.2, 0.2) });
    coverPage.drawText(title, { x: 75, y: curY, size: 8, font: fontHelvetica, color: rgb(0.1, 0.1, 0.1) });
    coverPage.drawText(fileName, { x: 260, y: curY, size: 8, font: fontHelvetica, color: rgb(0.3, 0.3, 0.3) });
    coverPage.drawText(validityText, { x: 430, y: curY, size: 8, font: fontHelvetica, color: rgb(0.15, 0.5, 0.2) });
    coverPage.drawText(pagesText, { x: 530, y: curY, size: 8, font: fontHelvetica, color: rgb(0.2, 0.2, 0.2) });

    curY -= 18;
  });

  // 3. Append all document pages in order
  for (const item of includedDocs) {
    if (!item.matchedFile) continue;
    let fileBytes = item.matchedFile.bytes;
    if (!fileBytes) {
      const arrayBuffer = await item.matchedFile.file.arrayBuffer();
      fileBytes = new Uint8Array(arrayBuffer);
    }

    const docPdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(docPdf, docPdf.getPageIndices());
    copiedPages.forEach(p => mergedPdf.addPage(p));
  }

  // 4. Running Footer on EVERY page: <tender_id> | Page X of Y
  const totalPages = mergedPdf.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const page = mergedPdf.getPage(i);
    const { width: pWidth } = page.getSize();
    const footerText = `${safeText(tender.tender_id)} | Page ${i + 1} of ${totalPages}`;
    const textWidth = fontHelvetica.widthOfTextAtSize(footerText, 8.5);

    // Subtle hairline separator above footer
    page.drawLine({
      start: { x: 35, y: 28 },
      end: { x: pWidth - 35, y: 28 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    });

    // Centered footer
    page.drawText(footerText, {
      x: (pWidth - textWidth) / 2,
      y: 16,
      size: 8.5,
      font: fontHelvetica,
      color: rgb(0.35, 0.35, 0.35),
    });
  }

  return await mergedPdf.save();
}

/**
 * Triggers a browser download of the generated PDF file.
 */
export function downloadPdf(bytes: Uint8Array, fileName: string): void {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
