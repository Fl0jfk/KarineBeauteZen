import axios from 'axios';

async function fetchCustomerData(token: string, title: string, amount: string) {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/api/success`, { params: { token, title, amount }});
    return response.data;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return null;
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: { token: string; title: string; amount: string } }) {
  const { token, title, amount } = searchParams;
  if (!token || !title || !amount) {
    return <div>Missing parameters.</div>;
  }
  const customerData = await fetchCustomerData(token, title, amount);
  if (!customerData) {
    return <div>Error loading customer data.</div>;
  }
  return (
    <main className='w-full h-[70vh] flex items-center justify-center flex-col gap-3 text-center sm:top-[10vh] md:top-[10vh] p-4'>
      <h1>✅ Paiement réussi!</h1>
      <div>
        <p>Merci pour votre achat, {customerData?.name}!</p>
        <ul>
          <li>Vous venez de recevoir votre email de confirmation à cette adresse: {customerData?.email}</li>
          <li>Vous allez être redirigé vers la page d&apos;accueil dans 15 secondes !</li>
        </ul>
      </div>
      <script dangerouslySetInnerHTML={{__html: `if (window.location.pathname === '/success'){ setTimeout(function() { window.location.href = '/'; }, 15000)}`}}/>
    </main>
  );
}