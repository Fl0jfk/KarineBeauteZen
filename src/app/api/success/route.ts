import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

const loadImageAsUint8Array = (fileName: string): Uint8Array => {
  const absolutePath = path.join(process.cwd(), "public", fileName);
  const buffer = fs.readFileSync(absolutePath);
  return new Uint8Array(buffer);
};

const createPDF = async ( orderCode: string, amount: string, title: string, nameCos: string, nameDes: string) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([800, 800]);
    const { height } = page.getSize();
    const logoBytes = loadImageAsUint8Array("logo.png");
    const kdoBytes = loadImageAsUint8Array("kdo.png");
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const kdoImage = await pdfDoc.embedPng(kdoBytes);
    const logoWidth = 150;
    const kdoWidth = 800;
    const kdoHeight = (kdoImage.height / kdoImage.width) * kdoWidth;
    const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
    page.drawImage(logoImage, { x: 25, y: height - logoHeight - 50, width: logoWidth, height: logoHeight});
    page.drawText(`Bonjour ${nameDes},`, { x: 25, y: height - logoHeight - 100, size: 24,});
    page.drawText(`${nameCos} vous a offert une carte cadeau Karine-Beauté-Zen`,{ x: 25, y: height - logoHeight - 150, size: 24 });
    page.drawText(`(${title})`, { x: 25, y: height - logoHeight - 200, size: 24,});
    page.drawText(`Le code de votre carte cadeau est : ${orderCode}`, { x: 25, y: height - logoHeight - 250, size: 32,});
    page.drawText(`Valeur de votre carte : ${amount}€`, { x: 25, y: height - logoHeight - 300,});
    page.drawText(`Votre carte est valide 1 an.`, { x: 25, y: height - logoHeight - 350,});
    page.drawText(`Pour réserver votre prestation ou tout autre renseignement,`, { x: 25, y: height - logoHeight - 400 });
    page.drawText(`appelez-le : 02.78.81.63.07`, { x: 25, y: height - logoHeight - 450,});
    page.drawImage(kdoImage, { x: 0, y: height - kdoHeight - 650, width: kdoWidth, height: kdoHeight,});
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (err) {
    throw err;
  }
};
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "session_id manquant dans l'URL" },{ status: 400 });
    }
    if (sessionId.startsWith("MANUAL_")) {
      const titleFromMeta = searchParams.get("title") || "Carte cadeau";
      const amountFromMeta = searchParams.get("amount") || "0";
      const nameCosFromMeta = searchParams.get("namecos") || "Nom acheteur";
      const nameDesFromMeta = searchParams.get("namedes") || "Nom bénéficiaire";
      const mailCosFromMeta = searchParams.get("mailcos") || "Mail acheteur";
      const orderCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      const pdfBytes = await createPDF( orderCode, amountFromMeta, titleFromMeta, nameCosFromMeta, nameDesFromMeta);
      const pdfAttachment = { filename: `gift_card_${orderCode}.pdf`, content: Buffer.from(pdfBytes), encoding: "base64"};
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "karinebeautezen@gmail.com",
          pass: process.env.MY_PASSWORD_GMAIL,
        },
      });
      await transporter.sendMail({
        from: "karinebeautezen@gmail.com",
        to: mailCosFromMeta,
        subject: `Carte cadeau créée manuellement (${orderCode})`,
        text: `Bonjour ${nameCosFromMeta},\n\nVotre carte cadeau "${titleFromMeta}" d'un montant de ${amountFromMeta}€ a été créée.\nCode : ${orderCode}.`,
        html: `<p>Bonjour ${nameCosFromMeta},</p>
<p>Votre carte cadeau <strong>"${titleFromMeta}"</strong> d'un montant de <strong>${amountFromMeta}€</strong> a été créée.</p>
<p><strong>Code : ${orderCode}</strong></p>`,
        attachments: [pdfAttachment],
      });
      await transporter.sendMail({
        from: "karinebeautezen@gmail.com",
        to: "karinebeautezen@aol.fr",
        subject: `Carte cadeau MANUELLE (${orderCode})`,
        text: `Une carte cadeau manuelle a été générée.
Acheteur : ${nameCosFromMeta} (${mailCosFromMeta})
Bénéficiaire : ${nameDesFromMeta}
Titre : ${titleFromMeta}
Montant : ${amountFromMeta}€
Code : ${orderCode}.`,
        html: `<p>Une carte cadeau manuelle a été générée.</p>
<p>Acheteur : <strong>${nameCosFromMeta}</strong> (${mailCosFromMeta})</p>
<p>Bénéficiaire : <strong>${nameDesFromMeta}</strong></p>
<p>Titre : <strong>${titleFromMeta}</strong></p>
<p>Montant : <strong>${amountFromMeta}€</strong></p>
<p><strong>Code : ${orderCode}</strong></p>`,
        attachments: [pdfAttachment],
      });
      const redirectUrl = new URL("/success", process.env.BASE_URL);
      redirectUrl.searchParams.set("session_id", sessionId);
      return NextResponse.redirect(redirectUrl.toString(), 302);
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["customer"]});
    const metadata = session.metadata || {};
    const titleFromMeta = metadata.title ?? "Titre non disponible";
    const amountFromMeta = metadata.amount ?? "0";
    const nameCosFromMeta = metadata.namecos ?? "Nom inconnu";
    const nameDesFromMeta = metadata.namedes ?? "Nom inconnu";
    const mailCosFromMeta = metadata.mailcos ?? "Mail inconnu";
    const orderCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    const pdfBytes = await createPDF( orderCode, amountFromMeta, titleFromMeta, nameCosFromMeta, nameDesFromMeta);
    const pdfAttachment = { filename: `gift_card_${orderCode}.pdf`, content: Buffer.from(pdfBytes), encoding: "base64"};
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "karinebeautezen@gmail.com",
        pass: process.env.MY_PASSWORD_GMAIL,
      }
    });
    await transporter.sendMail({
      from: "karinebeautezen@gmail.com",
      to: mailCosFromMeta,
      subject: `Merci pour votre achat, ${nameCosFromMeta}!`,
      text: `Merci pour votre achat, ${nameCosFromMeta}! Votre commande pour ${titleFromMeta} d'un montant de ${amountFromMeta}€ a été bien reçue. 
Votre code de commande est: ${orderCode}. 
Ce code est valable pour une durée d'un an.`,
      html: `<p>Merci pour votre achat, ${nameCosFromMeta}!</p>
<p>Votre commande pour <strong>${titleFromMeta}</strong> d'un montant de <strong>${amountFromMeta}€</strong> a été bien reçue.</p>
<p><strong>Votre code de commande est: ${orderCode}</strong></p>
<p>Ce code est valable pour une durée d'un an.</p>`,
      attachments: [pdfAttachment],
    });
    await transporter.sendMail({
      from: "karinebeautezen@gmail.com",
      to: "karinebeautezen@aol.fr",
      subject: "Nouvelle commande reçue",
      text: `Une nouvelle commande a été reçue de ${nameCosFromMeta} (${mailCosFromMeta}).
Produit commandé: ${titleFromMeta}.
Montant: ${amountFromMeta}€.
Code de commande: ${orderCode}.`,
      html: `<p>Une nouvelle commande a été reçue de <strong>${nameCosFromMeta}</strong> (${mailCosFromMeta}).</p>
<p>Produit commandé: <strong>${titleFromMeta}</strong>.</p>
<p>Montant: <strong>${amountFromMeta}€</strong>.</p>
<p><strong>Code de commande: ${orderCode}</strong>.</p>`,
      attachments: [pdfAttachment],
    });
    await transporter.sendMail({
      from: "karinebeautezen@gmail.com",
      to: "marineguerrache@aol.fr",
      subject: "Nouvelle commande reçue",
      text: `Une nouvelle commande a été reçue de ${nameCosFromMeta} (${mailCosFromMeta}).
Produit commandé: ${titleFromMeta}.
Montant: ${amountFromMeta}€.
Code de commande: ${orderCode}.`,
      html: `<p>Une nouvelle commande a été reçue de <strong>${nameCosFromMeta}</strong> (${mailCosFromMeta}).</p>
<p>Produit commandé: <strong>${titleFromMeta}</strong>.</p>
<p>Montant: <strong>${amountFromMeta}€</strong>.</p>
<p><strong>Code de commande: ${orderCode}</strong>.</p>`,
      attachments: [pdfAttachment],
    });
    const redirectUrl = new URL("/success", process.env.BASE_URL);
    redirectUrl.searchParams.set("session_id", sessionId);
    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Erreur inconnue" },{ status: 500 }
    );
  }
};