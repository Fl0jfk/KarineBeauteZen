import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const titleFromQuery = url.searchParams.get('title');
    const amountFromQuery = url.searchParams.get('amount');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }
    const customer = await stripe.customers.retrieve(token);
    if (!customer || customer.deleted) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    const customerEmail = customer.email ? customer.email : undefined;
    if (!customerEmail) {
      return NextResponse.json({ error: 'Customer email not available' }, { status: 400 });
    }
    const customerName = customer.name ? customer.name : undefined;
    const paymentIntents = await stripe.paymentIntents.list({ customer: customer.id, limit: 1 });
    const latestPaymentIntent = paymentIntents.data[0];
    if (!latestPaymentIntent || latestPaymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'No successful payment found for this customer' }, { status: 400 });
    }
    const metadata = latestPaymentIntent.metadata || {};
    const title = titleFromQuery || 'Titre non disponible';
    const amount = amountFromQuery || 'Montant non disponible';
    if (metadata.emailSent === 'true') {
      return NextResponse.json({ message: 'Email already sent' }, { status: 200 });
    }
    const orderCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_MY_EMAIL_GMAIL,
        pass: process.env.NEXT_PUBLIC_MY_PASSWORD_GMAIL
      }
    });
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_MY_EMAIL_GMAIL,
      to: customerEmail,
      subject: 'Confirmation de commande',
      text: `Merci pour votre achat, ${customerName}! Votre commande pour ${title} d'un montant de ${amount}€ a été bien reçue. 
             Votre code de commande est: ${orderCode}.
             Ce code est valable pour une durée d'un an. Il est personnel et attaché à votre identité.
             Si vous souhaitez offrir ce bon, vous pouvez contacter l'institut pour changer l'identité rattachée, ou fournir à la personne une photocopie de votre pièce d'identité.`,
      html: `<p>Merci pour votre achat, ${customerName}!</p>
             <p>Votre commande pour <strong>${title}</strong> d'un montant de <strong>${amount}€</strong> a été bien reçue.</p>
             <p><strong>Votre code de commande est: ${orderCode}</strong></p>
             <p>Ce code est valable pour une durée d'un an. Il est personnel et attaché à votre identité.</p>
             <p>Si vous souhaitez offrir ce bon, vous pouvez contacter l'institut pour changer l'identité rattachée, ou fournir à la personne une photocopie de votre pièce d'identité.</p>`
    });
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_MY_EMAIL_GMAIL,
      to: process.env.NEXT_PUBLIC_MY_EMAIL_GMAIL,
      subject: 'Nouvelle commande reçue',
      text: `Une nouvelle commande a été reçue de ${customerName} (${customerEmail}).
             Produit commandé: ${title}.
             Montant: ${amount}€.
             Code de commande: ${orderCode}.
             Le client a été informé que le code est personnel et valable pour un an.`,
      html: `<p>Une nouvelle commande a été reçue de <strong>${customerName}</strong> (${customerEmail}).</p>
             <p>Produit commandé: <strong>${title}</strong>.</p>
             <p>Montant: <strong>${amount}€</strong>.</p>
             <p><strong>Code de commande: ${orderCode}</strong>.</p>
             <p>Le client a été informé que le code est personnel et valable pour un an.</p>`
    });
    await stripe.paymentIntents.update(latestPaymentIntent.id, {
      metadata: { ...metadata, emailSent: 'true' }
    });
    return NextResponse.json({
      name: customerName,
      email: customerEmail,
      orderCode
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};