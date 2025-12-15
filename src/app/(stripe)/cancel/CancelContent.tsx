"use client";

import Link from "next/link";

export default function CancelContent() {
  return (
    <main className="w-full h-[40vh] flex items-center justify-center flex-col gap-3 text-center pt-[10vh] p-4">
      <h1 className="text-6xl">Paiement annulé</h1>
      <div>
        <p>Votre paiement n&apos;a pas été finalisé.</p>
        <Link href="/boutique" className="underline">Vous pouvez retourner sur la boutique en cliquant sur le lien.</Link>
      </div>
    </main>
  );
}