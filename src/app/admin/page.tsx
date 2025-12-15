/*
"use client";

import { useState } from "react";

export default function AdminTestPage() {
  const [namecos, setNamecos] = useState("");
  const [mailcos, setMailcos] = useState("");
  const [namedes, setNamedes] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);

    try {
      const manualSessionId =
        "MANUAL_" + Math.random().toString(36).slice(2, 8).toUpperCase();

      const params = new URLSearchParams({
        session_id: manualSessionId,
        title,
        amount,
        namecos,
        namedes,
        mailcos,
      });

      const res = await fetch(`/api/success?${params.toString()}`, {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Erreur lors de la génération du bon.");
        return;
      }

      setMsg(
        `Bon créé avec le code ${data.orderCode} (envoyé à ${data.email}).`
      );
    } catch (e: any) {
      setErr(e.message || "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-[60vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-semibold mb-4">
        Création manuelle de carte cadeau
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-3"
      >
        <input
          className="border px-3 py-2 rounded"
          placeholder="Nom acheteur"
          value={namecos}
          onChange={(e) => setNamecos(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 rounded"
          placeholder="Email acheteur"
          type="email"
          value={mailcos}
          onChange={(e) => setMailcos(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 rounded"
          placeholder="Nom bénéficiaire"
          value={namedes}
          onChange={(e) => setNamedes(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 rounded"
          placeholder="Titre de la carte (ex: Soin visage...)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 rounded"
          placeholder="Montant en €"
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 rounded bg-emerald-600 text-white disabled:bg-gray-400"
        >
          {loading ? "Création en cours..." : "Créer le bon manuellement"}
        </button>
      </form>

      {msg && <p className="mt-4 text-green-700 text-sm">{msg}</p>}
      {err && <p className="mt-4 text-red-600 text-sm">{err}</p>}
    </main>
  );
}
*/