import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

export const GET = async (request: NextRequest) => {
  try {
    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }
    const customer = await stripe.customers.retrieve(token);
    if (!customer || customer.deleted) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    const customerEmail = customer.email ? customer.email : undefined;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,  // Votre compte Gmail
        pass: process.env.GMAIL_PASSWORD  // Votre mot de passe ou mot de passe d'application
      }
    });
    if (customerEmail) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,  // Adresse e-mail de l'expéditeur
        to: customerEmail,  // Email du client
        subject: 'Confirmation de commande',
        text: `Merci pour votre achat, ${customer.name}! Votre commande a été bien reçue.`,
        html: `<p>Merci pour votre achat, ${customer.name}! Votre commande a été bien reçue.</p>`
      });
    }

    // Envoyer un email au propriétaire du site
    const siteOwnerEmail = process.env.SITE_OWNER_EMAIL;
    if (siteOwnerEmail) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: siteOwnerEmail,  // Email du propriétaire du site
        subject: 'Nouvelle commande reçue',
        text: `Une nouvelle commande a été reçue de ${customer.name} (${customer.email}).`,
        html: `<p>Une nouvelle commande a été reçue de ${customer.name} (${customer.email}).</p>`
      });
    }

    return NextResponse.json({
      name: customer.name,
      email: customer.email
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
