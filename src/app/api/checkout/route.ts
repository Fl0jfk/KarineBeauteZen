import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

console.log("400")
const stripe = new Stripe(process.env.STRIPE_SECRET as string);
console.log('Stripe API Key:', process.env.STRIPE_SECRET);

interface Data {
  title: string;
  price: number;
  image: string;
  city: string;
  cp: string;
  address: string;
  name: string;
  mail: string;
}

export const POST = async (request: NextRequest) => {
  try {
    const data: Data = await request.json();
    const customer = await stripe.customers.create({
      email: data.mail,
      address: {
        city: data.city,
        country: "FR",
        postal_code: data.cp,
        line1: data.address,
        state: "",
      },
      name: data.name,
    });
    const amountInCents = Math.round(data.price * 100);
    if (amountInCents < 1000) {
      throw new Error("Le prix doit être d'au moins 10€.");
    }
    console.log("Données avant Stripe:", data);
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      mode: "payment",
      success_url: `https://karine-beaute-zen.com/success?token=${customer.id}&title=${encodeURIComponent(data.title)}&amount=${data.price}`,
      cancel_url: `https://karine-beaute-zen.com/cancel?token=${customer.id}`,
      line_items: [{
        quantity: 1,
        price_data: {
          product_data: {
            name: data.title,
          },
          currency: "eur",
          unit_amount: amountInCents,
        },
      }],
      metadata: {
        title: data.title,
        amount: data.price.toFixed(2),
      },
    });
    console.log("Session de paiement Stripe créée:", checkoutSession);
    return NextResponse.json({ msg: checkoutSession, url: checkoutSession.url }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur de traitement de la commande:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
