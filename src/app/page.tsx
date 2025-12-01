import RollingSlider from "./components/Slider/RollingSlider";
import Modal from "./components/Modals/Modal";
import Testimonials from "./components/Testimonials/Testimonials";
import BrandList from "./components/List/BrandList";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <RollingSlider/>
      <Link href="/boutique" className="mx-auto block text-center text-4xl font-semibold mb-14 underline">Lien vers notre boutique !</Link>
      <BrandList/>
      <Testimonials/>
      <Modal/>
    </main>
  );
}
