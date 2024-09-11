import { useState } from "react";
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
  const dispatch = useDispatch()
  function handleFlip() {
    setWhatFace(!whatFace);
    dispatch(setInfoProduct(item))
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  }
  return (
    <motion.div
      className="h-[450px] sm:h-[400px] w-full"
      layout
      animate={{ opacity: 1, rotateY: isFlipped ? 180 : 360 }}
      transition={{ duration: 0.3 }}
      initial={false}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => setIsAnimating(false)}
    >
      <div className={`h-[450px] sm:h-[400px] rounded-xl overflow-hidden relative bg-white flip-card-front ${whatFace ? "" : "hidden"}`}>
        <Image
          src={item.image}
          alt={`Image de ${item.title}`}
          className="w-full h-48 object-cover"
          width={300}
          height={300}
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
          <p className="text-black bg-[#F2E9EB] rounded-md p-2 absolute top-2 right-2 mb-2">{item.price}€</p>
          <p className="text-gray-700 mb-4">{item.description}</p>
          <button onClick={() => handleFlip()} className="bg-[#F2E9EB] p-2 rounded-md text-black">
            Acheter
          </button>
        </div>
      </div>
      <div className={`h-[450px] sm:h-[400px] rounded-xl overflow-hidden flex flex-col gap-4 bg-white flip-card-back p-4 ${whatFace ? "hidden" : ""}`}>
        <h3 className="text-lg font-bold">Vous avez choisi notre soin : {item.title}</h3>
        <FormBuy amount={item.price}/>
      </div>
    </motion.div>
  );
}
