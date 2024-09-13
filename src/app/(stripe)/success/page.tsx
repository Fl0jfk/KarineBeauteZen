"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CustomerData {
  name: string;
  email: string;
}

async function fetchCustomerData(token: string): Promise<CustomerData | null> {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/api/success`, { params: { token } });
    return response.data;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return null;
  }
}

export default function SuccessPage({ searchParams }: { searchParams: { token: string } }) {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const router = useRouter();
  const token = searchParams.token;
  useEffect(() => {
    if (token) {
      fetchCustomerData(token).then((data) => {
        if (data) {
          setCustomerData(data);
          const timer = setTimeout(() => {
            router.push('/');
          }, 10000);
          return () => clearTimeout(timer);
        }
      });
    }
  }, [token, router]);
  return (
    <main className='w-full h-screen flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh]'>
      <h1>✅ Paiement réussi!</h1>
      <div>
        <p>Merci pour votre achat, {customerData?.name || 'client'}!</p>
        <ul>
          <li>Vous venez de recevoir votre email de confirmation à l'adresse : {customerData?.email || 'votre adresse email'}.</li>
          <li>Vous allez être redirigé vers la page d'accueil dans 10 secondes !</li>
        </ul>
      </div>
    </main>
  );
}
