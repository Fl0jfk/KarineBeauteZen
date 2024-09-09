"use client";

import { useSelector, useDispatch } from "react-redux";
import { modalState, setModalClose } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Dropdown from "../Dropdown/Dropdown";
import Link from "next/link";

export default function ModalSoins() {
  const modalIsVisible = useSelector((state: { modal: modalState }) => state.modal.modalSoins);
  const [modalIsVisibleClass, setModalIsVisibleClass] = useState<string>("");
  const dispatch = useDispatch();
  const closeModal = () => { dispatch(setModalClose()) };
  const data = useData();
  const modalRef = useRef<HTMLDivElement>(null);
  const soinsVisagesEtCorps = data.prestations[0]["Les soins visages et corps"];
  useEffect(() => {
    if (modalIsVisible) {
      setModalIsVisibleClass("");
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
      modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const timer = setTimeout(() => {
            setModalIsVisibleClass("hidden");
        }, 500);
          return () => clearTimeout(timer);
    }
  }, [modalIsVisible]);
  const modalVariants = {
    hidden: { opacity: 0, y: "-100vh" },
    visible: { opacity: 1, y: "0vh", transition: { duration: 0.4 } },
    exit: { opacity: 0, y: "100vh", transition: { duration: 0.6 } }
  };
  return (
    <motion.section
      ref={modalRef}
      className={`w-full h-full relative flex flex-col gap-4 ${modalIsVisibleClass}`}
      initial="hidden"
      animate={modalIsVisible ? "visible" : "hidden"}
      exit="exit"
      variants={modalVariants}
    >
      <div className="flex w-full justify-between">
        {data.categories[0] && <h3 className="text-4xl">{data.categories[0].name}</h3>}
        <button className="w-[35px] h-[35px] z-[2] bg-gray-700 rounded-full z-[1] p-2 hover:scale-105 transition ease-in-out duration-300" onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fill="#fff" d="M12.12,10l4.07-4.06a1.5,1.5,0,1,0-2.11-2.12L10,7.88,5.94,3.81A1.5,1.5,0,1,0,3.82,5.93L7.88,10,3.81,14.06a1.5,1.5,0,0,0,0,2.12,1.51,1.51,0,0,0,2.13,0L10,12.12l4.06,4.07a1.45,1.45,0,0,0,1.06.44,1.5,1.5,0,0,0,1.06-2.56Z"></path>
          </svg>
        </button>
      </div>
      {data.categories[0] && <p>{data.categories[0].shortDescription}</p>}
      {data.categories[0] && <p>{data.categories[0].description}</p>}
      <div className="w-full p-6 rounded-3xl">
        <Dropdown title="Les soins visages et corps" items={soinsVisagesEtCorps} />
      </div>
      <p>Une prestation vous intéresse vous pouvez prendre rendez-vous en appelant le : <Link href={`tel:${data.profile.telephone}`}>{data.profile.telephone}</Link>, en nous contactant via le <Link className="underline" onClick={closeModal} href={"/contact"}>formulaire</Link>. Vous pouvez offrir une prestation en vous rendant sur notre <Link onClick={closeModal} className="underline" href="/boutique">boutique en ligne</Link>.</p>
    </motion.section>
  );
}
