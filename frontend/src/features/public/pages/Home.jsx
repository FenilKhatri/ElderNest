import React from "react";
import HeroSection from "../sections/home/HeroSection";
import HealthcareEcosystem from "../sections/home/HealthcareEcosystem";
import CareServices from "../sections/home/CareServices";
import FamilyPeaceOfMind from "../sections/home/FamilyPeaceOfMind";
import CareJourney from "../sections/home/CareJourney";
import RefundProcess from "../sections/home/RefundProcess";
import CareStats from "../sections/home/CareStats";
import Testimonials from "../sections/home/Testimonials";
import EmotionalCTA from "../sections/home/EmotionalCTA";

const Home = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#0b1120] min-h-screen font-sans overflow-x-hidden">
      <HeroSection />
      <HealthcareEcosystem />
      <CareServices />
      <FamilyPeaceOfMind />
      <CareJourney />
      <RefundProcess />
      <CareStats />
      <Testimonials />
      <EmotionalCTA />
    </div>
  );
};

export default Home;
