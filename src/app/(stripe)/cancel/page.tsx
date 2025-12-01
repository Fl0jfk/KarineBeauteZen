'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type SearchParams = {
  token?: string;
};

async function fetchCustomerData(token: string) {
  const url = new URL('/api/success', window.location.origin);
  url.searchParams.set('token', token);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Failed to load customer data');
  }
  return res.json();
}

export default function CancelPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const token = searchParams.token;

  const [customerData, setCustomerData] = useState<{ name: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token not found.');
      return;
    }

    fetchCustomerData(token)
      .then((data) => setCustomerData(data))
      .catch((err) => {
        console.error(err);
        setError('Error loading customer data.');
      });
  }, [token]);

  if (error)
    return (
      <main className="w-full h-[40vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh]  p-4">
        <h1 className="text-6xl">Paiement annulé</h1>
        <div>
          <p>Votre paiement n&apos;a pas été finalisé.</p>
          <Link href="/boutique" className="underline">
            Vous pouvez retourner sur la boutique en cliquant sur le lien.
          </Link>
        </div>
      </main>
    );

  if (!customerData)
    return (
      <main className="w-full h-[40vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh]  p-4">
        <p>Chargement...</p>
      </main>
    );

  return (
    <main className="w-full h-[40vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh]  p-4">
      <h1 className="text-6xl">Paiement annulé</h1>
      <div>
        <p>Votre paiement n&apos;a pas été finalisé, {customerData.name}.</p>
        <Link href="/boutique" className="underline">
          Vous pouvez retourner sur la boutique en cliquant sur le lien.
        </Link>
      </div>
    </main>
  );
}
