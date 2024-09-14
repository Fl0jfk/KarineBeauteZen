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
    const amountInCents = Math.round(data.price * 100);
    if (amountInCents < 50) {
      throw new Error("The price is too low, must be at least 0.50 in your currency.");
    }
    const checkOutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/success?token=${customer.id}&title=${encodeURIComponent(data.title)}&amount=${data.price}`,
      cancel_url: `${process.env.BASE_URL}/cancel?token=` + customer.id,
      line_items: [{
        quantity: 1,
        price_data: {
          product_data: {
            name: data.title
          },
          currency: "EUR",
          unit_amount: amountInCents
        }
      }],
      metadata: {
        title: data.title,
        amount: data.price.toFixed(2)
      }
    });
    return NextResponse.json({ msg: checkOutSession, url: checkOutSession.url }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};