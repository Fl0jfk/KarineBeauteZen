import fs from "fs";
import path from "path";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const PAGE_W = 840;
const PAGE_H = 500;
const MARGIN = 48;

const colors = {
  blush: rgb(0.969, 0.933, 0.945),
  blushDeep: rgb(0.918, 0.851, 0.875),
  pearl: rgb(0.988, 0.976, 0.98),
  ink: rgb(0.165, 0.122, 0.141),
  inkSoft: rgb(0.361, 0.29, 0.322),
  accent: rgb(0.71, 0.42, 0.478),
  white: rgb(1, 1, 1),
};

const loadBytes = (fileName: string) =>
  new Uint8Array(fs.readFileSync(path.join(process.cwd(), "public", fileName)));

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
    } else {
      let chunk = "";
      for (const char of word) {
        const next = chunk + char;
        if (font.widthOfTextAtSize(next, size) > maxWidth && chunk) {
          lines.push(chunk);
          chunk = char;
        } else {
          chunk = next;
        }
      }
      current = chunk;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCentered(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  size: number,
  color = colors.ink,
  maxWidth = PAGE_W - MARGIN * 2
) {
  const lines = wrapText(text, font, size, maxWidth).slice(0, 3);
  let cursorY = y;
  for (const line of lines) {
    const width = font.widthOfTextAtSize(line, size);
    page.drawText(line, {
      x: (PAGE_W - width) / 2,
      y: cursorY,
      size,
      font,
      color,
    });
    cursorY -= size + 5;
  }
  return cursorY;
}

export async function createGiftCardPDF(
  orderCode: string,
  amount: string,
  title: string,
  nameCos: string,
  nameDes: string
) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  const serif = await pdfDoc.embedFont(loadBytes("fonts/DejaVuSerif.ttf"));
  const serifBold = await pdfDoc.embedFont(loadBytes("fonts/DejaVuSerif-Bold.ttf"));
  const sans = await pdfDoc.embedFont(loadBytes("fonts/DejaVuSans.ttf"));
  const sansBold = await pdfDoc.embedFont(loadBytes("fonts/DejaVuSans-Bold.ttf"));
  const logo = await pdfDoc.embedPng(loadBytes("logo.png"));

  // Fond
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: colors.blush });

  // Carte intérieure
  page.drawRectangle({
    x: 22,
    y: 22,
    width: PAGE_W - 44,
    height: PAGE_H - 44,
    color: colors.pearl,
    borderColor: colors.accent,
    borderWidth: 1.2,
  });

  // Bandeau haut
  page.drawRectangle({
    x: 22,
    y: PAGE_H - 86,
    width: PAGE_W - 44,
    height: 64,
    color: colors.blush,
  });

  // Bandeau bas
  page.drawRectangle({
    x: 22,
    y: 22,
    width: PAGE_W - 44,
    height: 56,
    color: colors.blush,
  });

  // Logo
  const logoSize = 42;
  page.drawImage(logo, {
    x: MARGIN,
    y: PAGE_H - 72,
    width: logoSize,
    height: logoSize,
  });

  const brand = "Karine Beauté Zen";
  page.drawText(brand, {
    x: MARGIN + logoSize + 12,
    y: PAGE_H - 52,
    size: 18,
    font: serif,
    color: colors.ink,
  });

  const label = "CARTE CADEAU";
  const labelW = sansBold.widthOfTextAtSize(label, 10);
  page.drawText(label, {
    x: PAGE_W - MARGIN - labelW,
    y: PAGE_H - 50,
    size: 10,
    font: sansBold,
    color: colors.accent,
  });

  // Corps
  let y = PAGE_H - 120;
  y = drawCentered(page, `Bonjour ${nameDes},`, y, serif, 18, colors.ink, PAGE_W - MARGIN * 3);
  y -= 4;
  y = drawCentered(
    page,
    `${nameCos} vous offre un moment pour vous`,
    y,
    sans,
    12,
    colors.inkSoft,
    PAGE_W - MARGIN * 3
  );
  y -= 14;

  // Encadré offre
  const boxW = 460;
  const boxX = (PAGE_W - boxW) / 2;
  const titleLines = wrapText(title, sansBold, 13, boxW - 48).slice(0, 2);
  const boxH = 86 + titleLines.length * 17;
  const boxY = Math.max(y - boxH + 12, 130);

  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxW,
    height: boxH,
    color: colors.white,
    borderColor: colors.blushDeep,
    borderWidth: 1,
  });

  // Petite ligne accent en haut de la boîte
  page.drawRectangle({
    x: boxX,
    y: boxY + boxH - 3,
    width: boxW,
    height: 3,
    color: colors.accent,
  });

  let ty = boxY + boxH - 28;
  for (const line of titleLines) {
    const w = sansBold.widthOfTextAtSize(line, 13);
    page.drawText(line, {
      x: boxX + (boxW - w) / 2,
      y: ty,
      size: 13,
      font: sansBold,
      color: colors.ink,
    });
    ty -= 17;
  }

  const amountLabel = `${amount} €`;
  const amountSize = 30;
  const amountW = serifBold.widthOfTextAtSize(amountLabel, amountSize);
  page.drawText(amountLabel, {
    x: boxX + (boxW - amountW) / 2,
    y: boxY + 16,
    size: amountSize,
    font: serifBold,
    color: colors.accent,
  });

  // Code — zone dédiée, au-dessus du bandeau bas
  const codeY = 108;
  const codeCaption = "Votre code";
  const captionW = sans.widthOfTextAtSize(codeCaption, 10);
  page.drawText(codeCaption, {
    x: (PAGE_W - captionW) / 2,
    y: codeY + 34,
    size: 10,
    font: sans,
    color: colors.inkSoft,
  });

  const codeSize = 20;
  const codeW = sansBold.widthOfTextAtSize(orderCode, codeSize);
  const padX = 22;
  const padY = 9;
  page.drawRectangle({
    x: (PAGE_W - codeW) / 2 - padX,
    y: codeY - padY,
    width: codeW + padX * 2,
    height: codeSize + padY * 2,
    color: colors.blush,
    borderColor: colors.accent,
    borderWidth: 1,
  });
  page.drawText(orderCode, {
    x: (PAGE_W - codeW) / 2,
    y: codeY,
    size: codeSize,
    font: sansBold,
    color: colors.ink,
  });

  // Pied de page dans le bandeau
  const foot1 = "Valable 1 an à compter de la date d'achat";
  const foot2 = "Réservation : 02.78.81.63.07  ·  40 route du Neubourg, 27370 Saint-Pierre-des-Fleurs";
  const f1w = sans.widthOfTextAtSize(foot1, 9);
  const f2w = sans.widthOfTextAtSize(foot2, 9);
  page.drawText(foot1, {
    x: (PAGE_W - f1w) / 2,
    y: 52,
    size: 9,
    font: sans,
    color: colors.inkSoft,
  });
  page.drawText(foot2, {
    x: (PAGE_W - f2w) / 2,
    y: 36,
    size: 9,
    font: sans,
    color: colors.inkSoft,
  });

  return pdfDoc.save();
}
