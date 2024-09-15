import axios from 'axios';
import Link from 'next/link';

async function fetchCustomerData(token: string) {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/api/success`,{ params: { token }});
    return response.data;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return (
      <main className='w-full h-[40vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh]  p-4'>
      <h1 className='text-6xl'>Paiement annulé</h1>
      <div>
        <p>Votre paiement n&apos;a pas été finalisé.</p>
        <Link href={"/boutique"} className='underline'>Vous pouvez retourner sur la boutique en cliquant sur le lien.</Link>
      </div>
      <script dangerouslySetInnerHTML={{__html: `if (window.location.pathname === '/cancel'){ setTimeout(function() { window.location.href = '/'; }, 15000)}`}}/>
    </main>
    );
  }
}

export default async function CancelPage({ searchParams }: { searchParams: { token: string } }) {
  const token = searchParams.token;
  if (!token) { return <div>Token not found.</div>;}
  const customerData = await fetchCustomerData(token);
  if (!customerData) { return <div>Error loading customer data.</div>;}
  return (
    <main className='w-full h-[40vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh]  p-4'>
      <h1 className='text-6xl'>Paiement annulé</h1>
      <div>
        <p>Votre paiement n&apos;a pas été finalisé, {customerData?.name}.</p>
        <Link href={"/boutique"} className='underline'>Vous pouvez retourner sur la boutique en cliquant sur le lien.</Link>
      </div>
      <script dangerouslySetInnerHTML={{__html: `if (window.location.pathname === '/cancel'){ setTimeout(function() { window.location.href = '/'; }, 15000)}`}}/>
    </main>
  );
}