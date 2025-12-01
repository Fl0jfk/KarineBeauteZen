import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useData } from '@/app/contexts/data';
import { setModalOpenCils, setModalOpenEpilation, setModalOpenManucure, setModalOpenMaquillage, setModalOpenSoins, setModalOpenSolarium } from '@/app/redux/reducers/modal';

export default function Navbar({menuOpened, onLinkClick} :NavbarProps ){
    const [clickOnLink, setClickOnLink] = useState(menuOpened);
    const menuOpen = (clickOnLink ? "bg-[#F2E9EB]" : "hidden");
    const [servicesAppear, setServicesAppear] = useState(false);
    const servicesVisible = (servicesAppear ? "" : "hidden");
    const restOfMenu = (!servicesAppear ? "" : "hidden");
    const dispatch = useDispatch();
    const data = useData()
    const handleModalOpen = (name:string) => {
        switch(name) {
            case 'Les soins visages et corps': dispatch(setModalOpenSoins());
                break;
            case 'Manucure': dispatch(setModalOpenManucure());
                break;
            case 'Épilation': dispatch(setModalOpenEpilation());
                break;
            case 'Cils et sourcils': dispatch(setModalOpenCils());
                break;
            case 'Maquillage': dispatch(setModalOpenMaquillage());
                break;
            case 'Solarium': dispatch(setModalOpenSolarium());
                break;
            default:
                break;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleLinkClick = () => {
        setClickOnLink(false);
        onLinkClick({ clickOnLink: false });
        setServicesAppear(false);
    };
    useEffect(() => {
        setClickOnLink(menuOpened)
        if(menuOpened){
            document.body.classList.add('overflow-hidden');
            setServicesAppear(false);
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [menuOpened])
    return (
        <AnimatePresence>
            {menuOpened && 
                <motion.nav  className={`${menuOpen} gap-6 text-2xl flex flex-col justify-center top-0 left-0 fixed items-center w-full h-[100vh] z-[9]`} initial={{translateX:"100%"}} animate={{translateX:"0%", transition:{duration: 0.5, ease: "easeInOut"}}} exit={{translateX:"100%", transition:{duration: 0.5, ease: "easeInOut"}}}>
                    <div className='w-2/12 h-[10vh] flex items-center justify-center w-full'>
                        <Link className='hover:scale-110 flex items-center justify-center' href="/" onClick={handleLinkClick} aria-label="Link to top">
                            <Image src="/Logo2.png" alt='Logo de LittleQueenPhotography' width={100} height={100} className='cursor-pointer z-[8]'/>
                        </Link>
                    </div>
                    <div className={`flex flex-col gap-6 justify-center items-center w-full ${restOfMenu}`}>
                        <Link className='hover:scale-110' href="/" onClick={handleLinkClick} aria-label="Lien vers la page d'accueil">Accueil</Link>
                        <div className='hover:scale-110 cursor-pointer' onClick={()=>setServicesAppear(true)} aria-label="Lien vers le sous menus mes services">Mes services</div>
                        <Link className='hover:scale-110' href="/boutique" onClick={handleLinkClick} aria-label="Lien vers la page boutique">Boutique</Link>
                        <Link className='hover:scale-110' href="/notreequipe" onClick={handleLinkClick} aria-label="Lien vers la page Notre Equipe">Notre Équipe</Link>
                        <Link className='hover:scale-110' href="/contact" onClick={handleLinkClick} aria-label="Lien vers la page contact">Contact</Link>
                    </div>
                    <div  className={`flex flex-col gap-4 justify-center items-center w-full ${servicesVisible}`}>
                        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" className='cursor-pointer absolute top-4 left-4' onClick={()=>setServicesAppear(false)}>
                            <path d="M11 6L5 12M5 12L11 18M5 12H19" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <button className='hover:scale-105 text-center' onClick={()=>handleModalOpen('Les soins visages et corps')} aria-label="Lien vers la modal soins">Les soins visages et corps</button>
                        <button className='hover:scale-105 text-center' onClick={()=>handleModalOpen('Manucure')} aria-label="Lien vers la modal Manucure">Manucure</button>
                        <button className='hover:scale-105 text-center' onClick={()=>handleModalOpen('Épilation')} aria-label="Lien vers la modal Épilation">Épilation</button>
                        <button className='hover:scale-105 text-center' onClick={()=>handleModalOpen('Cils et sourcils')} aria-label="Lien vers la modal Cils et sourcils">Cils et sourcils</button>
                        <button className='hover:scale-105 text-center' onClick={()=>handleModalOpen('Maquillage')} aria-label="Lien vers la modal Maquillage">Maquillage</button>
                        <button className='hover:scale-105 text-center' onClick={()=>handleModalOpen('Solarium')} aria-label="Lien vers la modal Solarium">Solarium</button>                       
                    </div>
                    <div className='flex gap-4'>
                        <Link href={`tel:${data.profile.telephone}`} className="hover:scale-[1.1] transition ease-in-out duration-100" onClick={handleLinkClick} target="blank">
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.3308 15.9402L15.6608 14.6101C15.8655 14.403 16.1092 14.2384 16.3778 14.1262C16.6465 14.014 16.9347 13.9563 17.2258 13.9563C17.517 13.9563 17.8052 14.014 18.0739 14.1262C18.3425 14.2384 18.5862 14.403 18.7908 14.6101L20.3508 16.1702C20.5579 16.3748 20.7224 16.6183 20.8346 16.887C20.9468 17.1556 21.0046 17.444 21.0046 17.7351C21.0046 18.0263 20.9468 18.3146 20.8346 18.5833C20.7224 18.8519 20.5579 19.0954 20.3508 19.3L19.6408 20.02C19.1516 20.514 18.5189 20.841 17.8329 20.9541C17.1469 21.0672 16.4427 20.9609 15.8208 20.6501C10.4691 17.8952 6.11008 13.5396 3.35083 8.19019C3.03976 7.56761 2.93414 6.86242 3.04914 6.17603C3.16414 5.48963 3.49384 4.85731 3.99085 4.37012L4.70081 3.65015C5.11674 3.23673 5.67937 3.00464 6.26581 3.00464C6.85225 3.00464 7.41488 3.23673 7.83081 3.65015L9.40082 5.22021C9.81424 5.63615 10.0463 6.19871 10.0463 6.78516C10.0463 7.3716 9.81424 7.93416 9.40082 8.3501L8.0708 9.68018C8.95021 10.8697 9.91617 11.9926 10.9608 13.04C11.9994 14.0804 13.116 15.04 14.3008 15.9102L14.3308 15.9402Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link> 
                        <Link href="https://www.facebook.com/karine.beautezen.9?locale=fr_FR" className="hover:scale-[1.1] transition ease-in-out duration-100" onClick={handleLinkClick} target="blank">
                            <svg width="30px" height="30px" viewBox="-5 0 20 20">
                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g transform="translate(-385.000000, -7399.000000)" fill="#000000">
                                        <g id="icons" transform="translate(56.000000, 160.000000)">
                                            <path d="M335.821282,7259 L335.821282,7250 L338.553693,7250 L339,7246 L335.821282,7246 L335.821282,7244.052 C335.821282,7243.022 335.847593,7242 337.286884,7242 L338.744689,7242 L338.744689,7239.14 C338.744689,7239.097 337.492497,7239 336.225687,7239 C333.580004,7239 331.923407,7240.657 331.923407,7243.7 L331.923407,7246 L329,7246 L329,7250 L331.923407,7250 L331.923407,7259 L335.821282,7259 Z" fill='#000'></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </Link>
                    </div>
                    <p className="self-center text-xl px-12">Horaires : du Lundi au Vendredi: 10:00-19:00 / Samedi : 10:00-18:00 / Dimanche : Fermé</p>
                </motion.nav>
            }
        </AnimatePresence>
    )
}

type NavbarProps = { menuOpened: boolean; onLinkClick: any}