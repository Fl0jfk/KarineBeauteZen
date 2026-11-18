import { randomBytes, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import { createGiftCardPDF } from "@/app/utils/create-gift-card-pdf";

export const runtime = "nodejs";

const SENDER = "karinebeautezen@gmail.com";
const OWNER = "karinebeautezen@aol.fr";
const OWNER_COPY = "marineguerrache@aol.fr";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const newOrderCode = () => randomBytes(4).toString("hex").toUpperCase();

const redirectTo = (path: string, sessionId?: string) => {
  const url = new URL(path, process.env.BASE_URL);
  if (sessionId) url.searchParams.set("session_id", sessionId);
  return NextResponse.redirect(url.toString(), 302);
};

const safeEqual = (a: string, b: string) => {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
};

type Card = {
  title: string;
  amount: string;
  nameCos: string;
  nameDes: string;
  mailCos: string;
};

const transporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: { user: SENDER, pass: process.env.MY_PASSWORD_GMAIL },
  });

async function sendPurchaseEmails(card: Card) {
  const { title, amount, nameCos, nameDes, mailCos } = card;
  const orderCode = newOrderCode();
  const pdfBytes = await createGiftCardPDF(orderCode, amount, title, nameCos, nameDes);
  const attachments = [{ filename: `gift_card_${orderCode}.pdf`, content: Buffer.from(pdfBytes), encoding: "base64" }];
  const mailer = transporter();

  await mailer.sendMail({
    from: SENDER,
    to: mailCos,
    subject: `Merci pour votre achat, ${nameCos}!`,
    text: `Merci pour votre achat, ${nameCos}! Votre commande pour ${title} d'un montant de ${amount}€ a été bien reçue. 
Votre code de commande est: ${orderCode}. 
Ce code est valable pour une durée d'un an.`,
    html: `<div style="font-family:Georgia,serif;color:#2A1F24;line-height:1.5">
<p>Merci pour votre achat, <strong>${esc(nameCos)}</strong>.</p>
<p>Votre carte cadeau <strong>${esc(title)}</strong> d'une valeur de <strong>${esc(amount)} €</strong> est prête.</p>
<p style="margin:24px 0;padding:16px 20px;background:#F7EEF1;border:1px solid #B56B7A;display:inline-block">
Code : <strong style="letter-spacing:0.08em">${orderCode}</strong>
</p>
<p>La carte PDF est jointe à cet e-mail — valable 1 an.</p>
<p style="color:#5C4A52;font-size:14px">Karine Beauté Zen · 02.78.81.63.07</p>
</div>`,
    attachments,
  });

  for (const to of [OWNER, OWNER_COPY]) {
    await mailer.sendMail({
      from: SENDER,
      to,
      subject: "Nouvelle commande reçue",
      text: `Une nouvelle commande a été reçue de ${nameCos} (${mailCos}).
Bénéficiaire: ${nameDes}.
Produit commandé: ${title}.
Montant: ${amount}€.
Code de commande: ${orderCode}.`,
      html: `<p>Une nouvelle commande a été reçue de <strong>${esc(nameCos)}</strong> (${esc(mailCos)}).</p>
<p>Bénéficiaire : <strong>${esc(nameDes)}</strong>.</p>
<p>Produit commandé: <strong>${esc(title)}</strong>.</p>
<p>Montant: <strong>${esc(amount)}€</strong>.</p>
<p><strong>Code de commande: ${orderCode}</strong>.</p>`,
      attachments,
    });
  }
}

async function sendManualEmails(card: Card) {
  const { title, amount, nameCos, nameDes, mailCos } = card;
  const orderCode = newOrderCode();
  const pdfBytes = await createGiftCardPDF(orderCode, amount, title, nameCos, nameDes);
  const attachments = [{ filename: `gift_card_${orderCode}.pdf`, content: Buffer.from(pdfBytes), encoding: "base64" }];
  const mailer = transporter();

  await mailer.sendMail({
    from: SENDER,
    to: mailCos,
    subject: `Carte cadeau créée manuellement (${orderCode})`,
    text: `Bonjour ${nameCos},\n\nVotre carte cadeau "${title}" d'un montant de ${amount}€ a été créée.\nCode : ${orderCode}.`,
    html: `<div style="font-family:Georgia,serif;color:#2A1F24;line-height:1.5">
<p>Bonjour ${esc(nameCos)},</p>
<p>Votre carte cadeau <strong>${esc(title)}</strong> d'une valeur de <strong>${esc(amount)} €</strong> a été créée.</p>
<p style="margin:24px 0;padding:16px 20px;background:#F7EEF1;border:1px solid #B56B7A;display:inline-block">
Code : <strong style="letter-spacing:0.08em">${orderCode}</strong>
</p>
<p>La carte PDF est jointe à cet e-mail.</p>
</div>`,
    attachments,
  });
  await mailer.sendMail({
    from: SENDER,
    to: OWNER,
    subject: `Carte cadeau MANUELLE (${orderCode})`,
    text: `Une carte cadeau manuelle a été générée.
Acheteur : ${nameCos} (${mailCos})
Bénéficiaire : ${nameDes}
Titre : ${title}
Montant : ${amount}€
Code : ${orderCode}.`,
    html: `<p>Une carte cadeau manuelle a été générée.</p>
<p>Acheteur : <strong>${esc(nameCos)}</strong> (${esc(mailCos)})</p>
<p>Bénéficiaire : <strong>${esc(nameDes)}</strong></p>
<p>Titre : <strong>${esc(title)}</strong></p>
<p>Montant : <strong>${esc(amount)}€</strong></p>
<p><strong>Code : ${orderCode}</strong></p>`,
    attachments,
  });
}

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const sessionId = searchParams.get("session_id");
    if (!sessionId || sessionId.length > 200) {
      return NextResponse.json({ error: "session_id manquant dans l'URL" }, { status: 400 });
    }

    // Création manuelle d'une carte : réservée à l'institut, désactivée sans MANUAL_CARD_SECRET
    if (sessionId.startsWith("MANUAL_")) {
      const secret = process.env.MANUAL_CARD_SECRET;
      const key = searchParams.get("key") ?? "";
      if (!secret || !safeEqual(key, secret)) {
        return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
      }
      const mailCos = (searchParams.get("mailcos") ?? "").trim();
      if (!EMAIL_RE.test(mailCos)) {
        return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
      }
      await sendManualEmails({
        title: (searchParams.get("title") || "Carte cadeau").slice(0, 100),
        amount: (searchParams.get("amount") || "0").slice(0, 10),
        nameCos: (searchParams.get("namecos") || "Nom acheteur").slice(0, 100),
        nameDes: (searchParams.get("namedes") || "Nom bénéficiaire").slice(0, 100),
        mailCos,
      });
      return redirectTo("/success", sessionId);
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET as string);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Aucune carte tant que le paiement n'est pas confirmé par Stripe
    if (session.payment_status !== "paid") {
      return redirectTo("/cancel", sessionId);
    }

    // Une seule émission par paiement : un rechargement de la page ne renvoie pas les e-mails
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    if (!paymentIntentId) {
      return NextResponse.json({ error: "Paiement introuvable." }, { status: 400 });
    }
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.metadata?.giftcard_sent !== "1") {
      await stripe.paymentIntents.update(paymentIntentId, { metadata: { giftcard_sent: "1" } });
      const metadata = session.metadata || {};
      try {
        await sendPurchaseEmails({
          title: metadata.title ?? "Titre non disponible",
          amount: metadata.amount ?? "0",
          nameCos: metadata.namecos ?? "Nom inconnu",
          nameDes: metadata.namedes ?? "Nom inconnu",
          mailCos: metadata.mailcos ?? "",
        });
      } catch (error) {
        await stripe.paymentIntents.update(paymentIntentId, { metadata: { giftcard_sent: "" } });
        throw error;
      }
    }
    return redirectTo("/success", sessionId);
  } catch (error) {
    console.error("Erreur /api/success:", error);
    return NextResponse.json({ error: "Une erreur est survenue lors de la confirmation de la commande." }, { status: 500 });
  }
};
