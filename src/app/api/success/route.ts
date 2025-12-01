import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

const loadImageAsUint8Array = (path: string): Uint8Array => {
  const buffer = fs.readFileSync(path);
  return new Uint8Array(buffer);
};

const createPDF = async (
  orderCode: string,
  amount: string,
  title: string,
  nameCosFromQuery: string,
  nameDesFromQuery: string
) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 800]);
  const { height } = page.getSize();
  const logoBytes = loadImageAsUint8Array("./public/logo.png");
  const kdoBytes = loadImageAsUint8Array("./public/kdo.png");
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const kdoImage = await pdfDoc.embedPng(kdoBytes);
  const logoWidth = 150;
  const kdoWidth = 800;
  const kdoHeight = (kdoImage.height / kdoImage.width) * kdoWidth;
  const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
  page.drawImage(logoImage, { x: 25,  y: height - logoHeight - 50,  width: logoWidth, height: logoHeight,});
  page.drawText(`Bonjour ${nameDesFromQuery},`, { x: 25, y: height - logoHeight - 100, size: 24 });
  page.drawText(`${nameCosFromQuery} vous a offert une carte cadeau Karine-Beauté-Zen`, { x: 25, y: height - logoHeight - 150, size: 24 });
  page.drawText(`(${title})`, { x: 25, y: height - logoHeight - 200, size: 24 });
  page.drawText(`Le code de votre carte cadeau est : ${orderCode}`, { x: 25, y: height - logoHeight - 250, size: 32});
  page.drawText(`Valeur de votre carte : ${amount}€`, { x: 25, y: height - logoHeight - 300,});
  page.drawText(`Votre carte est valide 1 an.`, { x: 25, y: height - logoHeight - 350,});
  page.drawText(`Pour réserver votre prestation ou tout autre renseignement,`,{ x: 25, y: height - logoHeight - 400 });
  page.drawText(`appelez-le : 02.78.81.63.07`, { x: 25, y: height - logoHeight - 450});
  page.drawImage(kdoImage, { x: 0, y: height - kdoHeight - 650, width: kdoWidth, height: kdoHeight});
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const titleFromQuery = searchParams.get("title") ?? "Titre non disponible";
    const amountFromQuery = searchParams.get("amount") ?? "Montant non disponible";
    const nameCosFromQuery = searchParams.get("namecos") ?? "Nom inconnu";
    const nameDesFromQuery = searchParams.get("namedes") ?? "Nom inconnu";
    const mailCosFromQuery = searchParams.get("mailcos") ?? "email-inconnu@exemple.com";
    const orderCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "karinebeautezen@gmail.com",
        pass: process.env.NEXT_PUBLIC_MY_PASSWORD_GMAIL,
      },
    });
    const pdfBytes = await createPDF( orderCode, amountFromQuery, titleFromQuery, nameCosFromQuery, nameDesFromQuery);
    const pdfAttachment = {
      filename: `gift_card_${orderCode}.pdf`,
      content: Buffer.from(pdfBytes),
      encoding: "base64",
    };
    await transporter.sendMail({
      from: "karinebeautezen@gmail.com",
      to: mailCosFromQuery,
      subject: `Merci pour votre achat, ${nameCosFromQuery}!`,
      text: `Merci pour votre achat, ${nameCosFromQuery}! Votre commande pour ${titleFromQuery} d'un montant de ${amountFromQuery}€ a été bien reçue. 
Votre code de commande est: ${orderCode}. 
Ce code est valable pour une durée d'un an.`,
      html: `<p>Merci pour votre achat, ${nameCosFromQuery}!</p>
<p>Votre commande pour <strong>${titleFromQuery}</strong> d'un montant de <strong>${amountFromQuery}€</strong> a été bien reçue.</p>
<p><strong>Votre code de commande est: ${orderCode}</strong></p>
<p>Ce code est valable pour une durée d'un an.</p>`,
      attachments: [pdfAttachment],
    });
    await transporter.sendMail({
      from: "karinebeautezen@gmail.com",
      to: "karinebeautezen@gmail.com",
      subject: "Nouvelle commande reçue",
      text: `Une nouvelle commande a été reçue de ${nameCosFromQuery} (${mailCosFromQuery}).
Produit commandé: ${titleFromQuery}.
Montant: ${amountFromQuery}€.
Code de commande: ${orderCode}.`,
      html: `<p>Une nouvelle commande a été reçue de <strong>${nameCosFromQuery}</strong> (${mailCosFromQuery}).</p>
<p>Produit commandé: <strong>${titleFromQuery}</strong>.</p>
<p>Montant: <strong>${amountFromQuery}€</strong>.</p>
<p><strong>Code de commande: ${orderCode}</strong>.</p>`,
      attachments: [pdfAttachment],
    });
    return NextResponse.json({ name: nameCosFromQuery, email: mailCosFromQuery, orderCode,},{ status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
