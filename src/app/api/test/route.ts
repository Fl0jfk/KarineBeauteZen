import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from 'fs';
import { PDFDocument } from "pdf-lib";

const createPDF = async (orderCode: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 800]);
  const { height } = page.getSize();
  const logoBytes = fs.readFileSync('./public/logo.png');
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoWidth = 150;
  const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
  page.drawImage(logoImage, { x: 50, y: height - logoHeight - 50, width: logoWidth, height: logoHeight});
  page.drawText(`flo vous a offert : test1`, { x: 50, y: height - logoHeight - 100, size: 24 });
  page.drawText(`Le code de votre chèque cadeau est : ${orderCode}`, { x: 50, y: height - logoHeight - 150 });
  page.drawText(`Valeur de votre chèque : 10€`, { x: 50, y: height - logoHeight - 200 });
  page.drawText(`Votre chèque est valide 1 an.`, { x: 50, y: height - logoHeight - 250 });
  page.drawText(`Pour réserver votre prestation appelez-le : 02.78.81.63.07`, { x: 50, y: height - logoHeight - 300 });
  const pdfBytes = await pdfDoc.save();1
  return pdfBytes;
};

export const POST = async (request: NextRequest) => {
  try {
    const orderCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    console.log("test")
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "karinebeautezen@gmail.com",
        pass: process.env.NEXT_PUBLIC_MY_PASSWORD_GMAIL
      }
    });
    const sendEmailToCustomer = async (message: string, subject: string, htmlMessage: string) => {
      await transporter.sendMail({
        from: "karinebeautezen@gmail.com",
        to: "florian.hacqueville@hotmail.fr",
        subject,
        text: message,
        html: htmlMessage,
      });
    };
 
      await sendEmailToCustomer(
        `Merci pour votre achat, Flo! Votre commande pour test1 d'un montant de 10€ a été bien reçue. 
        Votre code de commande est: ${orderCode}. Ce code est valable pour une durée d'un an. Il est personnel et attaché à votre identité.`,
        'Confirmation de commande',
        `<p>Merci pour votre achat, flo!</p>
         <p>Votre commande pour <strong>test1</strong> d'un montant de <strong>10€</strong> a été bien reçue.</p>
         <p><strong>Votre code de commande est: ${orderCode}</strong></p>
         <p>Ce code est valable pour une durée d'un an. Il est personnel et attaché à votre identité.</p>`
      )
      await sendEmailToCustomer(
        `Merci pour votre achat, Florian! Votre commande pour test d'un montant de 10€ a été bien reçue. 
        Votre code de commande est: ${orderCode}.
        Il a également été envoyé au destinataire du bon à l'adresse flo@mail.com.
        Ce code est valable pour une durée d'un an.`,
        'Confirmation de commande',
        `<p>Merci pour votre achat, flo!</p>
         <p>Votre commande pour <strong>test1</strong> d'un montant de <strong>10€</strong> a été bien reçue.</p>
         <p><strong>Votre code de commande est: ${orderCode}</strong></p>
         <p>Il a également été envoyé au destinataire du bon à l'adresse flo@mail.com</p>
         <p>Ce code est valable pour une durée d'un an.</p>`
      )
      await transporter.sendMail({
        from: "karinebeautezen@gmail.com",
        to: "florian.hacqueville@hotmail.fr",
        subject: `Vous avez reçu un bon d'achat Karine-Beauté-Zen`,
        text: `flo vous a offert un bon d'achat d'un montant de 10 dans notre institut ! 
        Votre code est: ${orderCode}. Ne le partagez pas. Ce code est valable pour une durée d'un an.`,
        html: `<p>flo vous a offert un bon d'achat d'un montant de 10 dans notre institut ! </p>
               <p>Votre code est: ${orderCode}.</p>
               <p><strong>Ne le partagez pas.</strong></p>
               <p>Ce code est valable pour une durée d'un an.</p>`
      });
      const pdfBytes = await createPDF(orderCode);
      const pdfAttachment = {
        filename: `gift_card_${orderCode}.pdf`,
        content: Buffer.from(pdfBytes),
        encoding: 'base64'
      };
      await transporter.sendMail({
        from: "karinebeautezen@gmail.com",
        to: "florian.hacqueville@hotmail.fr",
        subject: 'Votre bon cadeau Karine-Beauté-Zen',
        text: `Voici votre bon cadeau à imprimer avec le code ${orderCode}. Il est valable pour une durée d'un an.`,
        html: `<p>Voici votre bon cadeau à imprimer avec le code <strong>${orderCode}</strong>.</p>
               <p>Il est valable pour une durée d'un an.</p>`,
        attachments: [pdfAttachment]
      });
    await transporter.sendMail({
      from: "karinebeautezen@gmail.com",
      to: "karinebeautezen@gmail.com",
      subject: 'Nouvelle commande reçue',
      text: `Une nouvelle commande a été reçue de flo ("florian.hacqueville@hotmail.fr").
             Produit commandé: test1.
             Montant: 10€.
             Code de commande: ${orderCode}.`,
      html: `<p>Une nouvelle commande a été reçue de <strong>flo</strong> ("florian.hacqueville@hotmail.fr").</p>
             <p>Produit commandé: <strong>test1</strong>.</p>
             <p>Montant: <strong>10€</strong>.</p>
             <p><strong>Code de commande: ${orderCode}</strong>.</p>`
    });
    return NextResponse.json({ name: "florian", email: "florian.hacqueville@hotmail.fr", orderCode }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};