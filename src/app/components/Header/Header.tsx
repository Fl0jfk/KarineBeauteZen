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
  const [scrolled, setScrolled] = useState(false);

  const handleClick = () => setMenuOpened((prev) => !prev);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (menuOpened) {
      setHidden(false);
      return;
    }
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
  });

  const handleLinkClick = ({ clickOnLink }: HandleLinkClickProps) => {
    setMenuOpened(clickOnLink);
  };

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-[12] transition-colors duration-300 ${
        menuOpened
          ? "bg-blush h-screen"
          : scrolled
            ? "bg-pearl/90 backdrop-blur-md border-b border-blush-deep/40"
            : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[1400px] items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="relative z-[13] flex items-center gap-3"
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        >
          <Image
            src="/Logo2.png"
            alt="Logo Karine Beauté Zen"
            width={52}
            height={52}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="font-display text-xl tracking-[0.04em] text-ink sm:hidden">
            Karine Beauté Zen
          </span>
        </Link>

        <p className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 font-display text-2xl tracking-[0.12em] text-ink sm:block">
          Karine Beauté Zen
        </p>

        <div className="relative z-[13] flex items-center justify-end">
          <Navbar menuOpened={menuOpened} onLinkClick={handleLinkClick} />
          <div onClick={handleClick} className="flex h-11 w-11 items-center justify-end">
            <CrossButton menuOpened={menuOpened} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
