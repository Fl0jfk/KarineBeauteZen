"use client";

import { useSelector, useDispatch } from "react-redux";
import { modalState, setModalClose } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Dropdown from "../Dropdown/Dropdown";
import Map from "../Map/Map";

export default function ModalEpilation() {
  const modalIsVisible = useSelector((state: { modal: modalState }) => state.modal.modalEpilation);
  const [modalIsVisibleClass, setModalIsVisibleClass] = useState<string>(modalIsVisible ? "" : "hidden");
  const dispatch = useDispatch();
  const closeModal = () => { dispatch(setModalClose()) };
  const data = useData();
  const modalRef = useRef<HTMLDivElement>(null);
  const epilations = data.prestations[0]["Épilations"];
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
    <motion.section ref={modalRef} className={`w-full h-full relative flex flex-col gap-4 ${modalIsVisibleClass}`} initial="hidden" animate={modalIsVisible ? "visible" : "hidden"} exit="exit" variants={modalVariants}>
      <div className="flex relative w-full justify-between">
        {data.categories[2] && <h3 className="text-4xl">{data.categories[2].name}</h3>}
        <button className="w-[35px] h-[35px] z-[2] bg-gray-700 rounded-full z-[1] p-2 hover:scale-105 transition ease-in-out duration-300" onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fill="#fff" d="M12.12,10l4.07-4.06a1.5,1.5,0,1,0-2.11-2.12L10,7.88,5.94,3.81A1.5,1.5,0,1,0,3.82,5.93L7.88,10,3.81,14.06a1.5,1.5,0,0,0,0,2.12,1.51,1.51,0,0,0,2.13,0L10,12.12l4.06,4.07a1.45,1.45,0,0,0,1.06.44,1.5,1.5,0,0,0,1.06-2.56Z"></path>
          </svg>
        </button>
      </div>
      <Dropdown title="Épilations" items={epilations} />
      <p>Une prestation vous intéresse vous pouvez prendre rendez-vous en appelant le : <Link href={`tel:${data.profile.telephone}`}>{data.profile.telephone}</Link>, en nous contactant via le <Link className="underline" onClick={closeModal} href={"/contact"}>formulaire</Link>. Vous pouvez offrir une prestation en vous rendant sur notre <Link onClick={closeModal} className="underline" href="/boutique">boutique en ligne</Link>.</p>
      <div className="w-full h-[400px] mb-10">
        <Map/>
      </div>
      <button  onClick={()=>modalRef.current?.scrollIntoView({ behavior:'smooth'})}  className="border-2 mx-auto rounded-xl p-2 fixed bottom-16 right-4 bg-[#F2E9EB]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </motion.section>
  );
}
