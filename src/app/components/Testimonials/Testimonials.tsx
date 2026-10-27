"use client";

import { useEffect, useState } from "react";
import { useData } from "@/app/contexts/data";
import Image from "next/image";
import Link from "next/link";

interface Review {
  id: number;
  imageUser: string;
  nameUser: string;
  rating: number;
  message: string;
  link: string;
}

export default function Testimonials() {
  const { reviews } = useData();
  const [randomReviews, setRandomReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (reviews?.length) {
      const shuffled = [...reviews].sort(() => 0.5 - Math.random());
      setRandomReviews(shuffled.filter((r) => r.message).slice(0, 6));
    }
  }, [reviews]);

  if (!randomReviews.length) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
      <div className="mb-12 max-w-xl">
        <p className="mb-2 text-sm tracking-[0.22em] text-accent uppercase">Avis</p>
        <h2 className="font-display text-4xl text-ink md:text-5xl">Ce qu&apos;elles en disent</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {randomReviews.map((review) => (
          <Link
            key={review.id}
            href={review.link}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col border-t border-blush-deep/60 pt-6 transition hover:border-accent"
          >
            <div className="mb-4 flex items-center gap-3">
              <Image
                src={review.imageUser}
                alt={review.nameUser}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-ink">{review.nameUser}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < review.rating ? "text-accent" : "text-blush-deep"}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="line-clamp-5 text-ink-soft transition group-hover:text-ink">
              {review.message}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
