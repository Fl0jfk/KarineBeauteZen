"use client"

import { useEffect, useRef } from 'react';
import { useData } from '@/app/contexts/data';
import Image from 'next/image';

export default function BrandList() {
  const { brands } = useData();
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = window.scrollY * 1;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <section className="w-full p-4 max-w-[1200px] mx-auto flex flex-col gap-8 items-center">
      <h2 className="text-4xl">Nos Marques partenaires</h2>
      <div ref={containerRef} className="bg-white w-full h-[350px] rounded-xl overflow-hidden md:h-[250px] sm:h-[200px]">
        {brands.map((brand) => (
          <Image src={brand.logo} key={brand.id} alt={`Logo de la marque ${brand.name}`} width={800} height={800} className="w-full h-full"/>
        ))}
      </div>
    </section>
  );
}