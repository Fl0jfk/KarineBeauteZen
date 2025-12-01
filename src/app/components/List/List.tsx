import Card from "../Card/Card";

interface Shop {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

interface ListCardsProps {
  shop: Shop[];
}

export default function ListCards({ shop }: ListCardsProps) {
  return (
    <section>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4 h-full">
      {shop.map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </div>
    </section>
  );
}