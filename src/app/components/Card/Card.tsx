import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FormBuy from "../Forms/FormBuy";
import { useDispatch } from "react-redux";
import { setInfoProduct } from "@/app/redux/reducers/buy";

interface CardProps {
  item: {
    image: string;
    title: string;
    price: number;
    description: string;
  };
}

export default function Card({ item }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [whatFace, setWhatFace] = useState(true);
  const [customPrice, setCustomPrice] = useState(item.price);
  const dispatch = useDispatch();
  const cardRef = useRef<HTMLDivElement>(null);
  function handleFlip() {
    setWhatFace(!whatFace);
    dispatch(setInfoProduct({ ...item, price: customPrice }));
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  }
  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCustomPrice(Number(event.target.value));
  }
  const isButtonDisabled = customPrice < 10;
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        if (isFlipped) {
          setIsFlipped(false);
          setWhatFace(true);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFlipped]);
  return (
    <motion.div className="h-[400px] w-full" layout animate={{ opacity: 1, rotateY: isFlipped ? 180 : 360 }} transition={{ duration: 0.3 }} initial={false} exit={{ opacity: 0 }} onAnimationComplete={() => setIsAnimating(false)} ref={cardRef}>
      <div className={`h-[400px] rounded-xl overflow-hidden relative bg-white flip-card-front ${whatFace ? "" : "hidden"}`}>
        <Image src={item.image} alt={`Image de ${item.title}`} className="w-full h-48 object-cover" width={300} height={300}/>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
          {item.title === "Carte cadeau" ? (
            <>
              <p className="text-black bg-[#F2E9EB] rounded-md p-2 absolute top-2 right-2 mb-2">À partir de {item.price}€</p>
              <input type="number" value={customPrice} onChange={handlePriceChange} className="bg-[#F2E9EB] p-2 rounded-md text-black w-full mb-2" min="10"/>
            </>
          ) : (
            <p className="text-black bg-[#F2E9EB] rounded-md p-2 absolute top-2 right-2 mb-2">{item.price}€</p>
          )}
          <p className="text-gray-700 mb-4">{item.description}</p>
          <button onClick={() => handleFlip()} className={`bg-[#F2E9EB] p-2 rounded-md text-black ${ isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isButtonDisabled}>Acheter</button>
        </div>
      </div>
      <div className={`h-[400px] rounded-xl overflow-hidden flex flex-col gap-4 bg-white flip-card-back p-4 ${whatFace ? "hidden" : ""}`}>
        <h3 className="text-lg font-bold">Vous avez choisi : {item.title}</h3>
        <FormBuy amount={customPrice} />
      </div>
    </motion.div>
  );
}