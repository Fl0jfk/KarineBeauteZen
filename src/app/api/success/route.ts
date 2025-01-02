import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import fs from 'fs';
import { PDFDocument } from "pdf-lib";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET as string);

const loadImageAsUint8Array = (path: string): Uint8Array => {
  const buffer = fs.readFileSync(path);
  return new Uint8Array(buffer);
};

const createPDF = async (orderCode: string, amount:string, title:string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 800]);
  const { height } = page.getSize();
  const logoBytes = loadImageAsUint8Array('./public/logo.png');
  const kdoBytes = loadImageAsUint8Array('./public/kdo.png');
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const kdoImage = await pdfDoc.embedPng(kdoBytes);
  const logoWidth = 150;
  const kdoWidth = 800;
  const kdoHeight = (kdoImage.height / kdoImage.width) * kdoWidth;
  const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
  page.drawImage(logoImage, { x: 50, y: height - logoHeight - 50, width: logoWidth, height: logoHeight});
  page.drawText(`Vous avez une carte cadeau Karine-Beauté-Zen ! (${title})`, { x: 50, y: height - logoHeight - 100, size: 24 });
  page.drawText(`Le code de votre carte cadeau est : ${orderCode}`, { x: 50, y: height - logoHeight - 150 });
  page.drawText(`Valeur de votre carte : ${amount}`, { x: 50, y: height - logoHeight - 200 });
  page.drawText(`Votre carte est valide 1 an.`, { x: 50, y: height - logoHeight - 250 });
  page.drawText(`Pour réserver votre prestation ou tout autre renseignement,`, { x: 50, y: height - logoHeight - 300 });
  page.drawText(`appelez-le : 02.78.81.63.07`, { x: 50, y: height - logoHeight - 350 });
  page.drawImage(kdoImage, { x: 0, y: height - kdoHeight - 550, width: kdoWidth, height: kdoHeight});
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl; 
    const token = searchParams.get('token');
    const titleFromQuery = searchParams.get('title');
    const amountFromQuery = searchParams.get('amount');
    if (!token) { return NextResponse.json({ error: 'No token provided' }, { status: 400 })}
    const customer = await stripe.customers.retrieve(token);
    if (!customer || customer.deleted) {return NextResponse.json({ error: 'Customer not found' }, { status: 404 })}
    const customerEmail = customer.email || undefined;
    if (!customerEmail) { return NextResponse.json({ error: 'Customer email not available' }, { status: 400 })}
    const customerName = customer.name || undefined;
    const paymentIntents = await stripe.paymentIntents.list({ customer: customer.id, limit: 1 });
    const latestPaymentIntent = paymentIntents.data[0];
    if (!latestPaymentIntent || latestPaymentIntent.status !== 'succeeded') { return NextResponse.json({ error: 'No successful payment found for this customer' }, { status: 400 })}
    const metadata = latestPaymentIntent.metadata || {};
    const title = titleFromQuery || 'Titre non disponible';
    const amount = amountFromQuery || 'Montant non disponible';
    const orderCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "karinebeautezen@gmail.com",
        pass: process.env.NEXT_PUBLIC_MY_PASSWORD_GMAIL
      }
    });
    const pdfBytes = await createPDF(orderCode, title, amount);
    const pdfAttachment = {
      filename: `gift_card_${orderCode}.pdf`,
      content: Buffer.from(pdfBytes),
      encoding: 'base64'
    };
    await transporter.sendMail({
      from : "karinebeautezen@gmail.com",
      to: customerEmail,
      subject: `Merci pour votre achat, ${customerName}!`,
      text: `Merci pour votre achat, ${customerName}! Votre commande pour ${title} d'un montant de ${amount}€ a été bien reçue. 
            Votre code de commande est: ${orderCode}. 
            Ce code est valable pour une durée d'un an. Il est personnel et attaché à votre identité.`,
      html: `<p>Merci pour votre achat, ${customerName}!</p>
            <p>Votre commande pour <strong>${title}</strong> d'un montant de <strong>${amount}€</strong> a été bien reçue.</p>
            <p><strong>Votre code de commande est: ${orderCode}</strong></p>
            <p>Ce code est valable pour une durée d'un an. Il est personnel et attaché à votre identité.</p>`,
      attachments: [pdfAttachment]
  });
    await transporter.sendMail({
      from: "karinebeautezen@gmail.com",
      to: "karinebeautezen@gmail.com",
      subject: 'Nouvelle commande reçue',
      text: `Une nouvelle commande a été reçue de ${customerName} (${customerEmail}).
             Produit commandé: ${title}.
             Montant: ${amount}€.
             Code de commande: ${orderCode}.`,
      html: `<p>Une nouvelle commande a été reçue de <strong>${customerName}</strong> (${customerEmail}).</p>
             <p>Produit commandé: <strong>${title}</strong>.</p>
             <p>Montant: <strong>${amount}€</strong>.</p>
             <p><strong>Code de commande: ${orderCode}</strong>.</p>`      
    });
    await stripe.paymentIntents.update(latestPaymentIntent.id, {
      metadata: { ...metadata, emailSent: 'true' }
    });
    return NextResponse.json({ name: customerName, email: customerEmail, orderCode }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};