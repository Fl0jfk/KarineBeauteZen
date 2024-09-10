'use client';

import axios from 'axios';

function CustomerData({ customerData }: { customerData: any }) {
  if (!customerData) {
    return <p>Loading customer data...</p>;
  }
  return (
    <div>
      <p>Merci pour votre achat, {customerData?.name}!</p>
      <ul>
        <li>Email: {customerData?.email}</li>
      </ul>
    </div>
  );
}

export default function SuccessPage({ customerData }: { customerData: any }) {
  return (
    <div className='w-full h-screen flex items-center justify-center flex-col gap-3 text-center'>
      <h1>✅ Paiement réussi!</h1>
      <CustomerData customerData={customerData} />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { token } = context.query;
  if (!token) {
    return {
      notFound: true,
    };
  }
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/success`, {
      params: { token },
    });
    return {
      props: {
        customerData: res.data || null,
      },
    };
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return {
      props: {
        customerData: null,
      },
    };
  }
}