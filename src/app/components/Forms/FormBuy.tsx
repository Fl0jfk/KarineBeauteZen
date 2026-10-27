"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setInfoUser } from "@/app/redux/reducers/buy";

export type FormData = {
  name: string;
  email: string;
  city: string;
  message: string;
  line1: string;
  postal_code: string;
  nameDes: string;
};

interface FormBuyProps {
  amount: number;
}

const fieldClass =
  "w-full border border-blush-deep bg-surface px-4 py-3 text-ink outline-none transition focus:border-accent";

export default function FormBuy({ amount }: FormBuyProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<FormData>({ mode: "onChange" });
  const dispatch = useDispatch();
  const itemTitle = useSelector((state: { buy: { title: string } }) => state.buy.title);
  const itemPrice = useSelector((state: { buy: { price: number } }) => state.buy.price);
  const itemImage = useSelector((state: { buy: { image: string } }) => state.buy.image);

  function onSubmit(data: FormData) {
    dispatch(setInfoUser(data));
  }

  const Checkout = async () => {
    const formData = getValues();
    if (!isValid) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }
    try {
      const requestData = {
        title: itemTitle,
        price: itemPrice,
        image: itemImage,
        name: formData.name,
        mail: formData.email,
        address: formData.line1,
        city: formData.city,
        cp: formData.postal_code,
        nameDes: formData.nameDes,
      };
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) throw new Error("Erreur lors de la création de la session de paiement");
      const data = await res.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm text-ink-soft">
          Votre nom et prénom
        </label>
        <input
          autoComplete="name"
          id="name"
          type="text"
          placeholder="Nom et prénom"
          className={fieldClass}
          {...register("name", { required: true })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-ink-soft">
          Votre e-mail
        </label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          placeholder="exemple@domaine.fr"
          className={fieldClass}
          {...register("email", { required: true })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="address" className="text-sm text-ink-soft">
          Votre adresse
        </label>
        <input
          type="text"
          id="address"
          autoComplete="address-line1"
          placeholder="40, route du Neubourg"
          className={fieldClass}
          {...register("line1", { required: true })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cp" className="text-sm text-ink-soft">
            Code postal
          </label>
          <input
            type="text"
            id="cp"
            autoComplete="postal-code"
            placeholder="27370"
            className={fieldClass}
            {...register("postal_code", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-sm text-ink-soft">
            Ville
          </label>
          <input
            type="text"
            id="city"
            autoComplete="address-level2"
            placeholder="Saint-Pierre-des-Fleurs"
            className={fieldClass}
            {...register("city", { required: true })}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nameDes" className="text-sm text-ink-soft">
          Destinataire de la carte
        </label>
        <input
          autoComplete="name"
          id="nameDes"
          type="text"
          placeholder="Nom et prénom"
          className={fieldClass}
          {...register("nameDes", { required: true })}
        />
      </div>

      <button
        type="button"
        className={`mt-2 bg-ink px-5 py-3 text-sm tracking-wide text-pearl transition hover:bg-accent-deep ${
          !isValid ? "cursor-not-allowed opacity-40" : ""
        }`}
        onClick={Checkout}
        disabled={!isValid}
      >
        Payer {amount}€
      </button>
      <p className="text-xs text-ink-soft">Vous serez redirigé vers Stripe pour finaliser le paiement.</p>
    </form>
  );
}
