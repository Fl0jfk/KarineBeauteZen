"use client";

import Link from "next/link";
import Map from "../Map/Map";
import { useData } from "@/app/contexts/data";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { profile } = useData();
  const pathname = usePathname();

  return (
    <footer className="mt-10 border-t border-blush-deep/40 bg-pearl/60">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-display text-3xl text-ink">Karine Beauté Zen</p>
            <p className="mt-3 max-w-md text-ink-soft">
              {profile.adress}, {profile.postalcode} {profile.city}
            </p>
            <p className="mt-2 text-ink-soft">
              Lun–Ven 10h–19h · Sam 10h–18h · Dim fermé
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {pathname !== "/contact" && (
                <Link
                  href="/contact"
                  className="bg-ink px-5 py-2.5 text-sm tracking-wide text-pearl transition hover:bg-accent-deep"
                >
                  Nous contacter
                </Link>
              )}
              <Link
                href={`tel:${profile.telephone}`}
                className="border border-ink/20 px-5 py-2.5 text-sm tracking-wide text-ink transition hover:border-ink"
              >
                {profile.telephone || "Appeler"}
              </Link>
            </div>
          </div>

          <div className="h-[320px] w-full overflow-hidden md:h-[360px]">
            <Map />
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-blush-deep/40 pt-6 text-sm text-ink-soft md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="text-ink hover:text-accent-deep">
              Karine Beauté Zen
            </Link>{" "}
            — Tous droits réservés
          </p>
          <Link
            href="https://www.facebook.com/karine.beautezen.9?locale=fr_FR"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent-deep"
          >
            Facebook
          </Link>
        </div>
      </div>
    </footer>
  );
}
