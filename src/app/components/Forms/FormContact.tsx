"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { sendEmail } from "@/app/utils/send-email";

export type FormData = {
  name: string;
  email: string;
  telephone: string;
  message: string;
  website?: string;
  formStartedAt: number;
};

const fieldClass =
  "w-full border border-blush-deep bg-surface px-4 py-3 text-ink outline-none transition focus:border-accent";

function FormContact() {
  const startedAt = useRef(Date.now());
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      website: "",
      formStartedAt: startedAt.current,
    },
  });

  useEffect(() => {
    startedAt.current = Date.now();
    setValue("formStartedAt", startedAt.current);
  }, [setValue]);

  function onSubmit(data: FormData) {
    sendEmail({
      ...data,
      formStartedAt: startedAt.current,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} name="form email" className="relative flex w-full flex-col gap-5" noValidate>
      {/* Honeypot anti-bot : invisible pour les humains, souvent rempli par les scripts */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="website">Site web</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <input type="hidden" {...register("formStartedAt", { valueAsNumber: true })} />

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
