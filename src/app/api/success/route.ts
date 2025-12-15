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
  console.log("[PDF] Lecture fichier :", absolutePath);
  const buffer = fs.readFileSync(absolutePath);
  return new Uint8Array(buffer);
};

const createPDF = async (
  orderCode: string,
  amount: string,
  title: string,
  nameCos: string,
  nameDes: string
) => {
  try {
    console.log("[PDF] Début création PDF");
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
    console.log("[PDF] PDF généré, taille =", pdfBytes.length);
    return pdfBytes;
  } catch (err) {
    console.error("[PDF] Erreur création PDF :", err);
    throw err;
  }
};

export const GET = async (request: NextRequest) => {
  console.log(">>> /api/success handler CALLED");

  try {
    console.log(
      "[ENV] STRIPE_SECRET ?",
      !!process.env.STRIPE_SECRET,
      "| MY_PASSWORD_GMAIL ?",
      !!process.env.MY_PASSWORD_GMAIL
    );

    const { searchParams } = request.nextUrl;
    const sessionId = searchParams.get("session_id");
    console.log("[ROUTE] session_id =", sessionId);

    if (!sessionId) {
      console.warn("[ROUTE] session_id manquant dans l'URL");
      return NextResponse.json(
        { error: "session_id manquant dans l'URL" },
        { status: 400 }
      );
    }

    // ----- BRANCHE MANUELLE -----
    if (sessionId.startsWith("MANUAL_")) {
      console.log("[ROUTE] Branche MANUAL déclenchée");
      const titleFromMeta = searchParams.get("title") || "Carte cadeau";
      const amountFromMeta = searchParams.get("amount") || "0";
      const nameCosFromMeta =
        searchParams.get("namecos") || "Nom acheteur";
      const nameDesFromMeta =
        searchParams.get("namedes") || "Nom bénéficiaire";
      const mailCosFromMeta =
        searchParams.get("mailcos") || "Mail acheteur";

      const orderCode = Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase();
      console.log("[ROUTE][MANUAL] orderCode =", orderCode);

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
        console.error("[MAIL] Config email manquante (MY_PASSWORD_GMAIL)");
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

      console.log("[MAIL][MANUAL] Envoi mail client");
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
      console.log("[MAIL][MANUAL] Mail client OK");

      console.log("[MAIL][MANUAL] Envoi mail karine");
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
      console.log("[MAIL][MANUAL] Mail karine OK");

      // Après traitement manuel, rediriger vers /success aussi
      const redirectUrl = new URL("/success", process.env.BASE_URL);
      redirectUrl.searchParams.set("session_id", sessionId);
      console.log("[ROUTE][MANUAL] Redirection vers", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl.toString(), 302);
    }

    // ----- BRANCHE STRIPE CLASSIQUE -----
    console.log("[STRIPE] Récupération session Stripe");
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer"],
    });
    console.log("[STRIPE] Session OK:", session.id, "| mode =", session.mode);

    const metadata = session.metadata || {};
    console.log("[STRIPE] metadata récupérée =", metadata);

    const titleFromMeta = metadata.title ?? "Titre non disponible";
    const amountFromMeta = metadata.amount ?? "0";
    const nameCosFromMeta = metadata.namecos ?? "Nom inconnu";
    const nameDesFromMeta = metadata.namedes ?? "Nom inconnu";
    const mailCosFromMeta = metadata.mailcos ?? "Mail inconnu";

    console.log("[DATA] title =", titleFromMeta);
    console.log("[DATA] amount =", amountFromMeta);
    console.log("[DATA] nameCos =", nameCosFromMeta);
    console.log("[DATA] nameDes =", nameDesFromMeta);
    console.log("[DATA] mailCos =", mailCosFromMeta);

    const orderCode = Math.random()
      .toString(36)
      .substr(2, 8)
      .toUpperCase();
    console.log("[ROUTE][STRIPE] orderCode =", orderCode);

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
      console.error("[MAIL] Config email manquante (MY_PASSWORD_GMAIL)");
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
      logger: false,
      debug: false,
    });

    console.log("[MAIL][STRIPE] Envoi mail client");
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
    console.log("[MAIL][STRIPE] Mail client OK");

    console.log("[MAIL][STRIPE] Envoi mail karine");
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
    console.log("[MAIL][STRIPE] Mail karine OK");
    const redirectUrl = new URL("/success", process.env.BASE_URL);
    redirectUrl.searchParams.set("session_id", sessionId);
    console.log("[ROUTE][STRIPE] Redirection vers", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (error: any) {
    console.error("[ROUTE] Erreur finale /api/success:", error);
    return NextResponse.json(
      { error: error.message ?? "Erreur inconnue" },
      { status: 500 }
    );
  }
};
