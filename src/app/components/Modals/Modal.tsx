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
    const closeModal = () => {
        dispatch(setModalClose());
    };
    useEffect(() => {
        if (modalIsVisible) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
        return () => {
            document.body.classList.remove("modal-open");
        };
    }, [modalIsVisible]);
    const modalVariants = {
        hidden: { opacity: 0, y: "-100vh" },
        visible: { opacity: 1, y: "0vh", transition: { duration: 0.4 } },
        exit: { opacity: 0, y: "100vh", transition: { duration: 0.6 } }
    };
    return (
        <AnimatePresence>
            {modalIsVisible && (
                <>
                    <motion.section className="overflow-y-auto max-h-[95vh] w-[80vw] md:w-[90vw] md:left-[5vw] top-0 sm:w-[100vw] sm:left-[0vw] absolute left-[10vw] rounded-xl z-40 text-black p-6 sm:p-4 bg-white" initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
                        <ModalCils />
                        <ModalEpilation />
                        <ModalManucure />
                        <ModalSolarium />
                        <ModalSoins />
                        <ModalMaquillage />
                    </motion.section>
                    <motion.div className="fixed top-0 left-0 w-full h-full backdrop-blur-[2px] z-30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} onClick={closeModal}/>
                </>
            )}
        </AnimatePresence>
    );
}

