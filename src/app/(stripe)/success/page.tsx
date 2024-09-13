import axios from 'axios';

async function fetchCustomerData(token: string) {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/api/success`, {params: { token }});
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
  if (!customerData) { return <div>Error loading customer data.</div>}
  if (token && customerData){
  }
  return (
    <main className='w-full h-screen flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh]'>
      <h1>✅ Paiement réussi!</h1>
      <div>
        <p>Merci pour votre achat, {customerData?.name}!</p>
        <ul>
          <li>Vous venez de recevoir votre email de confirmation à cette adresse: {customerData?.email}</li>
        </ul>
      </div>
    </main>
  );
}