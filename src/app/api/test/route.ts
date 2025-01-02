import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from 'fs';
import { PDFDocument } from "pdf-lib";

const loadImageAsUint8Array = (path: string): Uint8Array => {
  const buffer = fs.readFileSync(path);
  return new Uint8Array(buffer);
};

const createPDF = async () => {
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
  page.drawText(`Vous avez une carte cadeau Karine-Beauté-Zen ! (test1)`, { x: 50, y: height - logoHeight - 100, size: 24 });
  page.drawText(`Le code de votre carte cadeau est : 1234`, { x: 50, y: height - logoHeight - 150 });
  page.drawText(`Valeur de votre carte : 50`, { x: 50, y: height - logoHeight - 200 });
  page.drawText(`Votre carte est valide 1 an.`, { x: 50, y: height - logoHeight - 250 });
  page.drawText(`Pour réserver votre prestation ou tout autre renseignement,`, { x: 50, y: height - logoHeight - 300 });
  page.drawText(`appelez-le : 02.78.81.63.07`, { x: 50, y: height - logoHeight - 350 });
  page.drawImage(kdoImage, { x: 0, y: height - kdoHeight - 550, width: kdoWidth, height: kdoHeight});
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export const POST = async (request: NextRequest) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "karinebeautezen@gmail.com",
        pass: process.env.NEXT_PUBLIC_MY_PASSWORD_GMAIL
      }
    });
    const pdfBytes = await createPDF();
    const pdfAttachment = {
      filename: `gift_card_1234.pdf`,
      content: Buffer.from(pdfBytes),
      encoding: 'base64'
    };
    await transporter.sendMail({
      from: "karinebeautezen@gmail.com",
      to: "florian.hacqueville@hotmail.fr",
      subject: `Merci pour votre achat, toto1! Votre commande pour test d'un montant de 50€ a été bien reçue.`,
      text: `Merci pour votre achat, toto1! Votre commande pour test d'un montant de 50€ a été bien reçue. 
            Votre code de commande est: 1234. Ce code est valable pour une durée d'un an. Il est personnel et attaché à votre identité.`,
      html: `<p>Merci pour votre achat, toti!</p>
              <p>Votre commande pour <strong>test</strong> d'un montant de <strong>50€</strong> a été bien reçue.</p>
              <p><strong>Votre code de commande est: 1234</strong></p>
              <p>Ce code est valable pour une durée d'un an. Il est personnel et attaché à votre identité.</p>`,
      attachments: [pdfAttachment]
    });
    await transporter.sendMail({
      from: "karinebeautezen@gmail.com",
      to: "karinebeautezen@gmail.com",
      subject: 'Nouvelle commande reçue',
      text: `Une nouvelle commande a été reçue de toti (mail).
             Produit commandé: tzst.
             Montant: 50€.
             Code de commande: 1234.`,
      html: `<p>Une nouvelle commande a été reçue de <strong>toti</strong> (mail).</p>
             <p>Produit commandé: <strong>tzst</strong>.</p>
             <p>Montant: <strong>50€</strong>.</p>
             <p><strong>Code de commande: 1234</strong>.</p>`       
    });
    return NextResponse.json({ name: "customerName", email: "customerEmail", orderCode:"1234" }, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};