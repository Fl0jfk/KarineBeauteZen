import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import { createGiftCardPDF } from "@/app/utils/create-gift-card-pdf";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);
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
      const pdfBytes = await createGiftCardPDF(orderCode, amountFromMeta, titleFromMeta, nameCosFromMeta, nameDesFromMeta);
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
        html: `<div style="font-family:Georgia,serif;color:#2A1F24;line-height:1.5">
<p>Bonjour ${nameCosFromMeta},</p>
<p>Votre carte cadeau <strong>${titleFromMeta}</strong> d'une valeur de <strong>${amountFromMeta} €</strong> a été créée.</p>
<p style="margin:24px 0;padding:16px 20px;background:#F7EEF1;border:1px solid #B56B7A;display:inline-block">
Code : <strong style="letter-spacing:0.08em">${orderCode}</strong>
</p>
<p>La carte PDF est jointe à cet e-mail.</p>
</div>`,
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
    const pdfBytes = await createGiftCardPDF(orderCode, amountFromMeta, titleFromMeta, nameCosFromMeta, nameDesFromMeta);
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
      html: `<div style="font-family:Georgia,serif;color:#2A1F24;line-height:1.5">
<p>Merci pour votre achat, <strong>${nameCosFromMeta}</strong>.</p>
<p>Votre carte cadeau <strong>${titleFromMeta}</strong> d'une valeur de <strong>${amountFromMeta} €</strong> est prête.</p>
<p style="margin:24px 0;padding:16px 20px;background:#F7EEF1;border:1px solid #B56B7A;display:inline-block">
Code : <strong style="letter-spacing:0.08em">${orderCode}</strong>
</p>
<p>La carte PDF est jointe à cet e-mail — valable 1 an.</p>
<p style="color:#5C4A52;font-size:14px">Karine Beauté Zen · 02.78.81.63.07</p>
</div>`,
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