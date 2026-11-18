import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { resolvePrice } from "@/lib/shop";

const MIN_FILL_MS = 2500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value: unknown, max: number) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= max ? trimmed : null;
};

const bad = (message: string) => NextResponse.json({ error: message }, { status: 400 });

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json().catch(() => null);
    if (!data || typeof data !== "object") return bad("Requête invalide.");

    // Honeypot rempli ou envoi trop rapide = bot : fausse réussite, aucun appel à Stripe
    const started = Number(data.formStartedAt);
    if (
      (typeof data.website === "string" && data.website.trim() !== "") ||
      !Number.isFinite(started) ||
      Date.now() - started < MIN_FILL_MS
    ) {
      return NextResponse.json({ url: "/boutique" }, { status: 200 });
    }

    // Le produit et le prix viennent du catalogue serveur, jamais du navigateur
    const product = resolvePrice(data.title, data.price);
    if (!product) return bad("Produit ou montant invalide.");

    const name = text(data.name, 100);
    const nameDes = text(data.nameDes, 100);
    const mail = text(data.mail, 150);
    const address = text(data.address, 150);
    const city = text(data.city, 80);
    const cp = text(data.cp, 10);
    if (!name || !nameDes || !mail || !address || !city || !cp) return bad("Veuillez remplir tous les champs correctement.");
    if (!EMAIL_RE.test(mail)) return bad("Adresse e-mail invalide.");

    const stripe = new Stripe(process.env.STRIPE_SECRET as string);
    const customer = await stripe.customers.create({
      email: mail,
      address: {
        city,
        country: "FR",
        postal_code: cp,
        line1: address,
        state: "",
      },
      name,
    });
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/api/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: product.title,
            },
            currency: "eur",
            unit_amount: Math.round(product.price * 100),
          },
        },
      ],
      metadata: {
        title: product.title,
        amount: product.price.toFixed(2),
        namecos: name,
        namedes: nameDes,
        mailcos: mail,
      },
    });
    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    console.error("Erreur Stripe /checkout:", error);
    return NextResponse.json({ error: "Impossible de créer la session de paiement." }, { status: 500 });
  }
};
