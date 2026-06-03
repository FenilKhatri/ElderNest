import React from "react";
import HeroSection from "../sections/home/HeroSection";
import WhyChooseUs from "../sections/home/WhyChooseUs";
import CareServices from "../sections/home/CareServices";
import CareStats from "../sections/home/CareStats";

const Home = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#0b1120] min-h-screen font-sans overflow-x-hidden">
      <HeroSection />
      <WhyChooseUs />
      <CareServices />
      <CareStats />
    </div>
  );
};

export default Home;
