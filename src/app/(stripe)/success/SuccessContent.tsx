'use client';

import { use, useEffect, useState } from 'react';

type SearchParams = {
  token?: string;
  title?: string;
  amount?: string;
  namecos?: string;
  namedes?: string;
  mailcos?: string;
};

type CustomerData = {
  name: string;
  email: string;
  orderCode: string;
};

async function fetchCustomerData(params: SearchParams) {
  const url = new URL('/api/success', window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  const res = await fetch(url.toString());
  if (!res.ok) { throw new Error('Failed to load customer data')}
  return res.json() as Promise<CustomerData>;
}

export default function SuccessContent({ searchParams}: { searchParams: Promise<SearchParams>}) {
  const { token, title, amount, namecos, namedes, mailcos } = use(searchParams);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!token || !title || !amount) {
      setError('Missing parameters.');
      return;
    }
    fetchCustomerData({ token, title, amount, namecos, namedes, mailcos })
      .then((data) => setCustomerData(data))
      .catch((err) => {
        console.error(err);
        setError('Error loading customer data.');
      });
  }, [token, title, amount, namecos, namedes, mailcos]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.location.pathname === '/success') { window.location.href = '/'}
    }, 15000);
    return () => clearTimeout(timer);
  }, []);
  if (error) return <div>{error}</div>;
  if (!customerData) return <div className="w-full h-[70vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[25vh] md:top-[25vh] p-4">Chargement...</div>;
  return (
    <main className="w-full h-[70vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[25vh] md:top-[25vh] p-4">
      <h1>✅ Paiement réussi!</h1>
      <div>
        <p>Merci pour votre achat, {customerData.name}!</p>
        <ul>
          <li>Vous venez de recevoir votre email de confirmation à cette adresse:{' '}{customerData.email}</li>
          <li>Vous allez être redirigé vers la page d&apos;accueil dans 15 secondes !</li>
        </ul>
      </div>
    </main>
  );
}
