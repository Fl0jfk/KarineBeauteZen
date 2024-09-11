import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

interface Data {
  title: string;
  price: number;
  image: string;
  city:string;
  cp:string;
  address:string;
  name:string;
  mail:string;
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

    // Conversion du prix en centimes (Stripe fonctionne avec des centimes)
    const amountInCents = Math.round(data.price * 100); // Convertir en centimes
    if (amountInCents < 50) { // Vérification que le montant est au moins de 50 centimes
      throw new Error("The price is too low, must be at least 0.50 in your currency.");
    }

    const checkOutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Méthodes de paiement acceptées
      customer: customer.id,
      mode: "payment", // Mode de paiement unique
      success_url: "http://localhost:3000/success?token=" + customer.id, // URL de succès
      cancel_url: "http://localhost:3000/cancel?token=" + customer.id, // URL d'annulation
      line_items: [{
        quantity: 1,
        price_data: {
          product_data: {
            name: data.title, // Nom du produit
          },
          currency: "EUR",
          unit_amount: amountInCents, // Montant en centimes
        }
      }]
    });
    return NextResponse.json({ msg: checkOutSession, url: checkOutSession.url }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
