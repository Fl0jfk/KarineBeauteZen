"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

interface CardProps {
  item: {
    image: string;
    title: string;
    price: number;
    description: string;
  };
}

export default function Card({ item }: CardProps) {
  const [loading, setLoading] = useState(false);
  const Checkout = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/checkout", {
        title: item.title,
        price: item.price,
        image: item.image,
      });
      const ResponseData = await response.data;
      window.location.href = ResponseData.url;
    } catch (error: any) {
    } finally { setLoading(false) }
  };
  return (
    <div className="rounded-lg shadow-lg overflow-hidden relative bg-white">
      <Image src={item.image} alt={`Image de ${item.title}`} className="w-full h-48 object-cover" width={300} height={300}/>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
        <p className="text-black bg-[#F2E9EB] rounded-md p-2 absolute top-2 right-2 mb-2">
          {item.price}€
        </p>
        <p className="text-gray-700 mb-4">{item.description}</p>
        <button onClick={Checkout} disabled={loading} className="bg-[#F2E9EB] p-2 rounded-md text-black">
          {loading ? "Chargement..." : "Acheter"}
        </button>
      </div>
    </div>
  );
}
