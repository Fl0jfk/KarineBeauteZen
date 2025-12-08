"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type CustomerData = {
  name: string;
  email: string;
  orderCode: string;
};

async function fetchCustomerData(sessionId: string) {
  const url = new URL("/api/success", window.location.origin);
  url.searchParams.set("session_id", sessionId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load customer data");
  return (await res.json()) as CustomerData;
}

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? undefined;
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!sessionId) {
      setError("session_id manquant.");
      return;
    }
    fetchCustomerData(sessionId)
      .then((data) => setCustomerData(data))
      .catch(() => setError("Erreur lors du chargement des données."));
  }, [sessionId]);
  if (error) return <div>{error}</div>;
  if (!customerData) return <div>Chargement...</div>;
  return (
    <main className="h-[50vh] mt-[10vh] flex items-center justify-center gap-4">
      <h1>✅ Paiement réussi!</h1>
      <p>Merci pour votre achat, {customerData.name}!</p>
      <p>Email de confirmation : {customerData.email}</p>
    </main>
  );
}
