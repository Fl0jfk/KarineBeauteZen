import RollingSlider from "./components/Slider/RollingSlider";
import Modal from "./components/Modals/Modal";
import Testimonials from "./components/Testimonials/Testimonials";

export default function Home() {
  return (
    <main className="md:pt-[10vh] sm:pt-[5vh]">
      <RollingSlider/>
      <Testimonials/>
      <Modal/>
    </main>
  );
}
