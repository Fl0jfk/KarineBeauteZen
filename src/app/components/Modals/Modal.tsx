"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { modalState, setModalClose } from "@/app/redux/reducers/modal";
import ModalCils from "./ModalCils";
import ModalEpilation from "./ModalEpilation";
import ModalManucure from "./ModalManucure";
import ModalMaquillage from "./ModalMaquillage";
import ModalSoins from "./ModalSoins";
import ModalSolarium from "./ModalSolarium";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal() {
  const modalIsVisible = useSelector((state: { modal: modalState }) => state.modal.modal);
  const dispatch = useDispatch();
  const closeModal = () => dispatch(setModalClose());

  useEffect(() => {
    if (modalIsVisible) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [modalIsVisible]);

  return (
    <AnimatePresence>
      {modalIsVisible && (
        <>
          <motion.div
            className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          />
          <motion.section
            className="fixed top-0 right-0 z-40 h-[100dvh] w-full max-w-2xl overflow-y-auto bg-pearl p-6 text-ink shadow-2xl md:p-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <ModalCils />
            <ModalEpilation />
            <ModalManucure />
            <ModalSolarium />
            <ModalSoins />
            <ModalMaquillage />
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
