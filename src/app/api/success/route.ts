import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

const loadImageAsUint8Array = (path: string): Uint8Array => {
  const buffer = fs.readFileSync(path);
  return new Uint8Array(buffer);
};

const createPDF = async (
  orderCode: string,
  amount: string,
  title: string,
  nameCos: string,
  nameDes: string
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
  page.drawImage(logoImage, {
    x: 25,
    y: height - logoHeight - 50,
    width: logoWidth,
    height: logoHeight,
  });
  page.drawText(`Bonjour ${nameDes},`, {
    x: 25,
    y: height - logoHeight - 100,
    size: 24,
  });
  page.drawText(
    `${nameCos} vous a offert une carte cadeau Karine-Beauté-Zen`,
    { x: 25, y: height - logoHeight - 150, size: 24 }
  );
  page.drawText(`(${title})`, {
    x: 25,
    y: height - logoHeight - 200,
    size: 24,
  });
  page.drawText(`Le code de votre carte cadeau est : ${orderCode}`, {
    x: 25,
    y: height - logoHeight - 250,
    size: 32,
  });
  page.drawText(`Valeur de votre carte : ${amount}€`, {
    x: 25,
    y: height - logoHeight - 300,
  });
  page.drawText(`Votre carte est valide 1 an.`, {
    x: 25,
    y: height - logoHeight - 350,
  });
  page.drawText(
    `Pour réserver votre prestation ou tout autre renseignement,`,
    { x: 25, y: height - logoHeight - 400 }
  );
  page.drawText(`appelez-le : 02.78.81.63.07`, {
    x: 25,
    y: height - logoHeight - 450,
  });
  page.drawImage(kdoImage, {
    x: 0,
    y: height - kdoHeight - 650,
    width: kdoWidth,
    height: kdoHeight,
  });
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id manquant dans l'URL" },
        { status: 400 }
      );
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer"],
    });
    const metadata = session.metadata || {};
    const titleFromMeta = metadata.title ?? "Titre non disponible";
    const amountFromMeta = metadata.amount ?? "0";
    const nameCosFromMeta = metadata.namecos ?? "Nom inconnu";
    const nameDesFromMeta = metadata.namedes ?? "Nom inconnu";
    const mailCosFromMeta =  metadata.mailcos ?? "email-inconnu@exemple.com";
    const orderCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    const pdfBytes = await createPDF(
      orderCode,
      amountFromMeta,
      titleFromMeta,
      nameCosFromMeta,
      nameDesFromMeta
    );
    const pdfAttachment = {
      filename: `gift_card_${orderCode}.pdf`,
      content: Buffer.from(pdfBytes),
      encoding: "base64",
    };
    if (!process.env.MY_PASSWORD_GMAIL) {
      console.error("MY_PASSWORD_GMAIL manquant");
      return NextResponse.json(
        { error: "Config email manquante" },
        { status: 500 }
      );
    }
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
      return NextResponse.json(
      { name: nameCosFromMeta, email: mailCosFromMeta, orderCode },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Erreur /api/success:", error);
    return NextResponse.json(
      { error: error.message ?? "Erreur inconnue" },
      { status: 500 }
    );
  }
};
