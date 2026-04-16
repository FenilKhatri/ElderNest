import CareServices from "../../components/sections/home/CareServices";
import CareStats from "../../components/sections/home/CareStats";
import HeroSection from "../../components/sections/home/HeroSection"
import WhyChooseUs from "../../components/sections/home/WhyChooseUs";
import Process from "../../components/ui/Process";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <CareStats />
      <CareServices />
      <Process />
    </div>
  );
}

export default Home