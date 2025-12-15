"use client";

import { useState } from "react";
import Image from "next/image";
import CrossButton from "../Buttons/CrossButton";
import Navbar from "../Navbar/Navbar";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";

type HandleLinkClickProps = {
  clickOnLink: boolean;
};

export default function Header() {
  const { scrollY } = useScroll();
  const [menuOpened, setMenuOpened] = useState(false);
  const [hidden, setHidden] = useState(false);
  const opacityMenu = !menuOpened ? "opacity-80 ease-linear duration-300 h-[10vh]" : "h-[100vh] ease-linear duration-300";
  const handleClick = () => { setMenuOpened((prev) => !prev);};
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (menuOpened) {
      setHidden(false);
      return;
    }
    if (latest > previous && latest > 150) {  setHidden(true);
    } else { setHidden(false);
    }
  });
  const handleLinkClick = ({ clickOnLink }: HandleLinkClickProps) => {  setMenuOpened(clickOnLink);};
  return (
    <motion.header variants={{ visible: { y: 0 }, hidden: { y: "-100%" }}} animate={hidden ? "hidden" : "visible"}transition={{ duration: 0.35, ease: "easeInOut" }} className={`flex p-4 justify-between items-center w-full fixed z-[12] top-0 bg-[#F2E9EB] ${opacityMenu} self-center text-2xl overflow-hidden max-w-[1500px] mx-auto`}>
      <div className="w-2/12 flex items-center h-full">
        <Link href="/">
          <Image src="/Logo2.png" alt="Logo du site web" width={80} height={80} className="cursor-pointer z-[8]" onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}}/>
        </Link>
      </div>
      <p>KARINE BEAUTE ZEN</p>
      <div className="w-2/12 flex justify-end items-center sm:mt-[-5px] h-full">
        <Navbar menuOpened={menuOpened} onLinkClick={handleLinkClick} />
        <div  className="flex justify-end w-[40] items-center h-full"  onClick={handleClick}>
          <CrossButton menuOpened={menuOpened} />
        </div>
      </div>
    </motion.header>
  );
}
