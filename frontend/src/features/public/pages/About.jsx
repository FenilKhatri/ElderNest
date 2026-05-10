import { useEffect, useState } from "react";
import BackgroundGlow from "../../admin/components/BackgroundGlow";
import Hero from "../../admin/components/Hero";
import Mission from "../../admin/components/Mission";
import Vision from "../../admin/components/Vision";
import WhyChooseUs from "../../admin/components/WhyChooseUs";
import Services from "../../admin/components/Services";
import Professionals from "../../admin/components/Professionals";
import Process from "../../../components/ui/Process";
import Testimonials from "../../admin/components/Testimonials";
import CTA from "../../admin/components/CTA";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="relative overflow-hidden">
        <BackgroundGlow />
        <Hero
          Slogan="Trusted by 10,000+ families"
          Title="Compassionate Home Healthcare for Your Loved Ones"
          Description="Trusted, professional, and compassionate elderly care services
            delivered at home by verified caregivers and trained healthcare
            professionals."
        />
        <Mission
          Title="Our Mission"
          Description="Improving quality of life through trusted in-home care"
          SubDescription="Our mission is to improve the quality of life for seniors by
              connecting families with trained and verified caregivers who
              provide reliable home healthcare services. We believe everyone
              deserves to age with dignity in the familiar surroundings of their
              own home."
        />
        <Vision
          Title="Our Vision"
          Description="Building a healthcare platform families can truly trust"
          SubDescription="Our vision is to make elderly healthcare accessible, safe, and
            reliable for families across the country through human-centered care
            and thoughtful technology."
        />
        <WhyChooseUs
          loading={loading}
          Title="Why Choose Us"
          Description="Why families choose us with confidence"
          SubDescription="We adhere to the highest standards of care and verification to
            ensure your loved ones are always in safe hands."
        />
        <Services
          Title="Care Services"
          Description="Comprehensive care services at your doorstep"
          SubDescription="A wide range of professional healthcare services tailored to the
            needs of elderly patients and their families."
        />
        <Professionals
          Title="Our Professionals"
          Description="Meet our trusted professionals"
          SubDescription="Highly trained, deeply compassionate, and thoroughly verified."
        />
        <Process
          loading={loading}
          Title="How It Works"
          Description="A simple and transparent care journey"
          SubDescription="A clear process to help your family find the right care quickly and
            confidently."
        />
        <Testimonials
          Title="Testimonials"
          Description="What families say about us"
          SubDescription="Real stories from families who trusted us with their loved ones’
            care."
        />
        <CTA
          Title="Get Started"
          Description="Give your loved ones the care they deserve"
          SubDescription="Connect with verified professionals today and gain peace of mind
                for your family."
        />
      </div>
    </>
  );
};

export default About;
