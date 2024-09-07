import { useSelector, useDispatch } from "react-redux";
import { modalState, setModalClose } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";
import { useRef, useEffect } from "react";

export default function ModalEpilation() {
    const modalIsVisible = useSelector((state: { modal: modalState }) => state.modal.modalEpilation);
    const modalIsVisibleClass = (modalIsVisible ? "" : "hidden");
    const modalRef = useRef<HTMLDivElement>(null);
    const data = useData();
    const dispatch = useDispatch();
    const closeModal = () => { dispatch(setModalClose()) };
    useEffect(() => {
        if (modalIsVisible) {
            modalRef.current?.scrollIntoView({behavior: "smooth" });
            modalRef.current?.scrollTo({top: 0, behavior: 'smooth' });
        }
    }, [modalIsVisible]);
    return (
        <section ref={modalRef} className={`${modalIsVisibleClass} w-full h-full relative flex flex-col gap-4`}>
            {data.categories[2]&& <p className="text-xl text-white text-sm">{data.categories[2].name}</p>}
            <div className="flex relative w-full justify-between">
                {data.categories[2]&& <h3 className="text-4xl">{data.categories[2].name}</h3>}
                <button className="w-[35px] h-[35px] z-[2] bg-gray-700 rounded-full z-[1] p-2 hover:scale-105 transition ease-in-out duration-300" onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="#fff" d="M12.12,10l4.07-4.06a1.5,1.5,0,1,0-2.11-2.12L10,7.88,5.94,3.81A1.5,1.5,0,1,0,3.82,5.93L7.88,10,3.81,14.06a1.5,1.5,0,0,0,0,2.12,1.51,1.51,0,0,0,2.13,0L10,12.12l4.06,4.07a1.45,1.45,0,0,0,1.06.44,1.5,1.5,0,0,0,1.06-2.56Z"></path>
                    </svg>
                </button>
            </div>
            {data.categories[2]&&<p>{data.categories[2].shortDescription}</p>}
            {data.categories[2]&&<p>{data.categories[2].description}</p>}
            <div className="w-full grid grid-cols-4 gap-4 mx-auto md:grid-cols-2 sm:grid-cols-1 p-6 rounded-3xl">
                
            </div>
        </section>
    )
}