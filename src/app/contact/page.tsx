import FormContact from "../components/Forms/FormContact";

export default function Contact() {
  return (
    <main className="pt-24 md:pt-28">
      <section className="mx-auto flex w-full max-w-xl flex-col gap-8 px-5 pb-20 md:px-8">
        <div>
          <p className="mb-2 text-sm tracking-[0.22em] text-accent uppercase">Contact</p>
          <h1 className="font-display text-5xl text-ink md:text-6xl">Écrivons-nous</h1>
          <p className="mt-4 text-ink-soft">
            Une question, un rendez-vous ou une idée cadeau ? Laissez-nous un message, on vous
            répond rapidement.
          </p>
        </div>
        <FormContact />
      </section>
    </main>
  );
}
