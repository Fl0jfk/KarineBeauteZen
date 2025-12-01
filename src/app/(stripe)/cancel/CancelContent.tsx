'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

type SearchParams = {
  token?: string;
};

type CancelCustomerData = {
  name: string;
};

async function fetchCustomerData(token: string) {
  const url = new URL('/api/success', window.location.origin);
  url.searchParams.set('token', token);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Failed to load customer data');
  }
  return res.json() as Promise<CancelCustomerData>;
}

export default function CancelContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { token } = use(searchParams);

  const [customerData, setCustomerData] = useState<CancelCustomerData | null>(
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
      <main className="w-full h-[40vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh] p-4">
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
      <main className="w-full h-[40vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh] p-4">
        <p>Chargement...</p>
      </main>
    );

  return (
    <main className="w-full h-[40vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh] p-4">
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
