import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, telephone, message } = await req.json();
    if (!name || !email || !telephone || !message) {return NextResponse.json( { message: 'Tous les champs sont obligatoires.' },{ status: 400 });}
    if (!process.env.MY_PASSWORD_GMAIL) {return NextResponse.json({ message: 'Mot de passe Gmail manquant dans les variables env.' },{ status: 500 });}
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
    return NextResponse.json({ message: 'Votre message a bien été envoyé.' },{ status: 200 });
  } catch (error: any) {
    console.error('Erreur envoi email /api/email:', error);
    return NextResponse.json({ message: 'Une erreur est survenue lors de l’envoi de votre message.' },{ status: 500 });
  }
}
