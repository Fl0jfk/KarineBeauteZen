"use client";

import { useForm } from "react-hook-form";
import { sendEmail } from "@/app/utils/send-email";

export type FormData = {
  name: string;
  email: string;
  telephone: string;
  message: string;
};

const fieldClass =
  "w-full border border-blush-deep bg-surface px-4 py-3 text-ink outline-none transition focus:border-accent";

function FormContact() {
  const { register, handleSubmit } = useForm<FormData>();

  function onSubmit(data: FormData) {
    sendEmail(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} name="form email" className="flex w-full flex-col gap-5">
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
          Votre adresse mail
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
        <label htmlFor="telephone" className="text-sm text-ink-soft">
          Votre numéro de téléphone
        </label>
        <input
          type="tel"
          id="telephone"
          autoComplete="tel"
          placeholder="0607080910"
          className={fieldClass}
          {...register("telephone", { required: true })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm text-ink-soft">
          Message
        </label>
        <textarea
          rows={5}
          id="message"
          placeholder="Écrivez votre message ici…"
          className={`${fieldClass} resize-none`}
          {...register("message", { required: true })}
        />
      </div>
      <button
        type="submit"
        className="bg-ink px-6 py-3 text-sm tracking-wide text-pearl transition hover:bg-accent-deep"
      >
        Envoyer
      </button>
    </form>
  );
}

export default FormContact;
