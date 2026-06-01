import HeroSection from "../sections/home/HeroSection";
import WhyChooseUs from "../sections/home/WhyChooseUs";
import CareStats from "../sections/home/CareStats";
import CareServices from "../sections/home/CareServices";
import Process from "../../../components/ui/Process";

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <WhyChooseUs />
      <CareStats />
      <CareServices />
      <Process />
    </div>
  );
};

export default Home;
