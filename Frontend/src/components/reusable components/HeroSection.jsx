import { NavLink } from "react-router-dom";
import HeroBg from "../../assets/images/Hero BG.png";
import Button from "../common/Button";
import { ShieldCheck } from "lucide-react";
import { Clock3 } from "lucide-react";
import { HeartHandshake } from "lucide-react";

const HeroSection = () => {

    const labelDesign = "w-full md:w-fit text-center px-3 py-2 rounded-md bg-slate-100 font-semibold text-slate-800";

  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-3 gap-5">
        {/* Hero Left */}
        <div className="flex flex-col items-center md:items-start space-y-10 max-w-3xl">
          <div className="w-fit bg-blue-100 text-slate-800 font-semibold px-3 py-2 rounded-lg">
            Compassionate in-home care
          </div>
          <p className="text-2xl lg:text-5xl text-center md:text-left font-bold text-slate-800 max-w-lg">
            Trusted Home Healthcare for Your Loved Ones
          </p>
          <p className="text-slate-500 text-justify text-lg max-w-lg">
            Connect with verified nurses, caregivers, physiotherapists and
            elderly care attendants who provide compassionate home care
            services.
          </p>
          <div className="w-full flex flex-col md:flex-row items-center justify-start gap-3">
            <NavLink to="/caregivers-login" className="w-full md:w-fit">
              <Button size="lg" className="w-full">Book Care Now</Button>
            </NavLink>
            <NavLink to="*" className="w-full md:w-fit">
              <Button variant="outline" size="lg" className="w-full">
                Request Call Back
              </Button>
            </NavLink>
          </div>
          <div className="flex items-center justify-start gap-3">
            <div className="flex items-center gap-5">
              <div>
                <ShieldCheck size={18} className="text-emerald-500" />
                <p>Verified caregivers</p>
              </div>
              <div>
                <Clock3 size={18} className="text-blue-500" />
                <p>24/7 Support</p>
              </div>
              <div>
                <HeartHandshake size={18} className="text-teal-500" />
                <p>Trusted by families</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-fit flex flex-col md:flex-row items-center justify-start gap-3">
            <p className={labelDesign}>
              Google Services
            </p>
            <p className={labelDesign}>
              Justdial Trusted
            </p>
            <p className={labelDesign}>
              Lybrate Listed
            </p>
          </div>
        </div>
        {/* Hero Right */}
        <div>
          <img src={HeroBg} alt="Hero BG" className="w-xl md:w-2xl" />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
