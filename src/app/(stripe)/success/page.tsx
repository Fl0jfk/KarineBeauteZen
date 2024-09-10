'use client';

import axios from 'axios';

async function fetchCustomerData(token: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/success`, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return null;
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: { token: string } }) {
  const token = searchParams.token;
  if (!token) { return <div>Token not found.</div>;}
  const customerData = await fetchCustomerData(token);
  if (!customerData) { return <div>Error loading customer data.</div>;}
  return (
    <div className='w-full h-screen flex items-center justify-center flex-col gap-3 text-center'>
      <h1>✅ Paiement réussi!</h1>
      <div>
        <p>Merci pour votre achat, {customerData?.name}!</p>
        <ul>
          <li>Email: {customerData?.email}</li>
        </ul>
      </div>
    </div>
  );
}