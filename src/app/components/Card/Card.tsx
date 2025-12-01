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
    const newPrice = Number(event.target.value);
    if (newPrice <= 200) { setCustomPrice(newPrice)}
  }
  const isButtonDisabled = customPrice < 10 || customPrice > 200;
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
    <motion.div className="h-[550px] w-full" layout  animate={{ opacity: 1, rotateY: isFlipped ? 180 : 360 }} transition={{ duration: 0.3 }} initial={false} exit={{ opacity: 0 }} onAnimationComplete={() => setIsAnimating(false)} ref={cardRef} style={{ transformStyle: "preserve-3d" }}>
      <div className={`h-[550px] rounded-xl overflow-hidden relative flex flex-col bg-white flip-card-front ${whatFace ? "" : "hidden"}`} style={{ backfaceVisibility: "hidden" }}>
        <Image src={item.image} alt={`Image de ${item.title}`} className="w-full min-h-[250px] object-cover" width={250} height={250}/>
        <div className="p-4 flex flex-col justify-between h-full">
          <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
          {item.title === "Carte cadeau" ? (
            <>
              <p className="text-black bg-[#F2E9EB] rounded-md p-2 absolute top-2 right-2 mb-2">À partir de {item.price}€</p>
              <input type="number" value={customPrice} onChange={handlePriceChange} className="bg-[#F2E9EB] p-2 rounded-md text-black w-full text-xl mb-2" min="10" max="200"/>
            </>
          ) : (
            <p className="text-black bg-[#F2E9EB] rounded-md p-2 absolute top-2 right-2 mb-2 text-xl">{item.price}€</p>
          )}
          <p className="text-gray-700 mb-4 text-xl">{item.description}</p>
          <button onClick={handleFlip} className={`bg-[#F2E9EB] p-2 rounded-md text-black w-1/3 text-xl ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isButtonDisabled}>Acheter</button>
        </div>
      </div>
      <div className={`h-[550px] rounded-xl overflow-hidden flex flex-col justify-between gap-4 bg-white flip-card-back p-4 ${whatFace ? "hidden" : ""}`} style={{ backfaceVisibility: "hidden" }}>
        <h3 className="text-lg font-bold">Vous avez choisi : {item.title}</h3>
        <FormBuy amount={customPrice}/>
      </div>
    </motion.div>
  );
}
