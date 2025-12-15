"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return <div>session_id manquant.</div>;
  }

  return (
    <main className="h-[50vh] mt-[10vh] flex flex-col items-center justify-center gap-4">
      <h1>✅ Paiement réussi !</h1>
      <p>Merci pour votre achat.</p>
      <p>Un e-mail de confirmation vient de vous être envoyé.</p>
    </main>
  );
}