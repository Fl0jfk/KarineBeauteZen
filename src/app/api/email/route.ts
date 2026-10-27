import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const MIN_FILL_MS = 2500;
const MAX_MESSAGE_LENGTH = 5000;

function fakeSuccess() {
  return NextResponse.json(
    { message: 'Votre message a bien été envoyé.' },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      telephone,
      message,
      website,
      formStartedAt,
    } = body ?? {};

    // Honeypot rempli = bot → on fait semblant que ça a marché
    if (typeof website === 'string' && website.trim() !== '') {
      return fakeSuccess();
    }

    // Envoi trop rapide = bot
    const started = Number(formStartedAt);
    if (!Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) {
      return fakeSuccess();
    }

    if (!name || !email || !telephone || !message) {
      return NextResponse.json(
        { message: 'Tous les champs sont obligatoires.' },
        { status: 400 }
      );
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof telephone !== 'string' ||
      typeof message !== 'string'
    ) {
      return NextResponse.json({ message: 'Requête invalide.' }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { message: 'Votre message est trop long.' },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { message: 'Adresse e-mail invalide.' },
        { status: 400 }
      );
    }

    if (!process.env.MY_PASSWORD_GMAIL) {
      return NextResponse.json(
        { message: 'Mot de passe Gmail manquant dans les variables env.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karinebeautezen@gmail.com',
        pass: process.env.MY_PASSWORD_GMAIL,
      },
    });

    await transporter.sendMail({
      from: `"Formulaire site" <karinebeautezen@gmail.com>`,
      to: 'karinebeautezen@aol.fr',
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      text: `
Nom : ${name}
Email : ${email}
Téléphone : ${telephone}

Message :
${message}
      `,
    });

    return NextResponse.json(
      { message: 'Votre message a bien été envoyé.' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Erreur envoi email /api/email:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de l’envoi de votre message.' },
      { status: 500 }
    );
  }
}
