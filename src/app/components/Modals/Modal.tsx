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

export default function Modal() {
    const modalIsVisible = useSelector((state: { modal: modalState }) => state.modal.modal);
    const dispatch = useDispatch();
    const modalIsVisibleClass = modalIsVisible ? "" : "hidden";
    const closeModal = () => { dispatch(setModalClose());};
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
    return (
        <>
            <section className={`overflow-y-auto max-h-[90vh] w-[80vw] md:w-[90vw] md:left-[5vw] md:top-[10vh] sm:top-[10vh] sm:w-[100vw] sm:left-[0vw] absolute left-[10vw] rounded-xl z-40 text-black p-6 sm:p-4 bg-white ${modalIsVisibleClass}`}>
                <ModalCils/>
                <ModalEpilation/>
                <ModalManucure/>
                <ModalSolarium/>
                <ModalSoins/>
                <ModalMaquillage/>
            </section>
            <div className={`fixed top-0 left-0 w-full h-full backdrop-blur-[2px] z-30 ${modalIsVisibleClass}`} onClick={closeModal}></div>
        </>
    );
}
