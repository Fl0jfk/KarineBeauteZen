import Card from "../Card/Card";
import type { OfferRequest } from "@/lib/gift";

interface Shop {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

interface ListCardsProps {
  shop: Shop[];
  offer?: OfferRequest | null;
}

export default function ListCards({ shop, offer }: ListCardsProps) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 pb-20 md:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {shop.map((item) => (
          <Card key={item.id} item={item} offer={offer?.id === item.id ? offer : undefined} />
        ))}
      </div>
    </section>
  );
}
