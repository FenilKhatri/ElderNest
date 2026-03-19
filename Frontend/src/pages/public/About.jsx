import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/common/Button";
import {
  cardData,
  stats,
  testimonials,
  serviceItems,
  processSteps,
  visionItems,
} from "../../data/aboutPage";
import AboutPagePhoto1 from "../../assets/images/AboutUs/AboutPagePhoto1.jpeg";
import AboutPagePhoto2 from "../../assets/images/AboutUs/AboutPagePhoto2.png";
import { HeartHandshake, Quote, ShieldCheck, Stethoscope } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const CardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="mt-5 h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 space-y-3">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-4/6 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
};

const StatSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 animate-pulse">
      <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
};

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const visionCardClass =
    "group flex flex-col items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 min-w-[140px]";

  return (
    <>
      <div className="relative overflow-hidden">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-0 top-[20%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute left-0 bottom-[10%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <NavLink to="/caregivers-login">
            <Button className="w-full shadow-xl shadow-blue-500/20">
              Book Care Service
            </Button>
          </NavLink>
        </div>

        {/* Hero */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto px-5 py-10 md:py-16"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center md:items-start space-y-8 max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Trusted by 10,000+ families
                </span>
              </div>

              <h1 className="max-w-2xl text-3xl lg:text-6xl font-bold text-slate-900 dark:text-white text-center md:text-left leading-tight tracking-tight">
                Compassionate Home Healthcare for Your Loved Ones
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl text-center md:text-left leading-8">
                Trusted, professional, and compassionate elderly care services
                delivered at home by verified caregivers and trained healthcare
                professionals.
              </p>

              <div className="w-full flex flex-col sm:flex-row items-center justify-start gap-3">
                <NavLink to="/caregivers-login" className="w-full sm:w-fit">
                  <Button
                    size="lg"
                    className="w-full shadow-lg shadow-blue-500/20"
                  >
                    Book Care Service
                  </Button>
                </NavLink>

                <NavLink to="/contact" className="w-full sm:w-fit">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur border-slate-300 dark:border-slate-700 dark:text-white"
                  >
                    Talk To Our Experts
                  </Button>
                </NavLink>
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="relative">
              <div className="absolute inset-0 rounded-4xl bg-linear-to-tr from-blue-500/20 to-cyan-400/20 blur-2xl" />
              <img
                src={AboutPagePhoto1}
                alt="Healthcare service"
                className="relative w-full max-w-xl rounded-4xl shadow-2xl border border-white/40 dark:border-slate-800"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Mission */}
        <section className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur md:p-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-5 gap-10">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="order-2 md:order-1"
            >
              <img
                src={AboutPagePhoto2}
                alt="Healthcare mission"
                className="w-full max-w-xl rounded-4xl shadow-xl border border-white/40 dark:border-slate-700"
              />
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="order-1 md:order-2 flex flex-col items-center md:items-start space-y-8"
            >
              <motion.p
                variants={fadeUp}
                className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600"
              >
                Our Mission
              </motion.p>

              <motion.h2
                variants={fadeUp}
                className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white text-center md:text-left leading-tight"
              >
                Improving quality of life through trusted in-home care
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="text-slate-600 dark:text-slate-400 text-justify text-base max-w-lg leading-8"
              >
                Our mission is to improve the quality of life for seniors by
                connecting families with trained and verified caregivers who
                provide reliable home healthcare services. We believe everyone
                deserves to age with dignity in the familiar surroundings of
                their own home.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="w-full flex flex-wrap items-center justify-center md:justify-start gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md">
                    <ShieldCheck className="text-white w-5 h-5" />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-semibold">
                    Safety
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-rose-500 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md">
                    <HeartHandshake className="text-white w-5 h-5" />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-semibold">
                    Compassion
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md">
                    <Stethoscope className="text-white w-5 h-5" />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100 font-semibold">
                    Professional Care
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Vision */}
        <section className="max-w-7xl mx-auto px-5 py-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-4xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur p-6 md:p-10 flex flex-col space-y-10"
          >
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 text-center"
            >
              Our Vision
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white text-center leading-tight"
            >
              Building a healthcare platform families can truly trust
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-center text-lg leading-8"
            >
              Our vision is to make elderly healthcare accessible, safe, and
              reliable for families across the country through human-centered
              care and thoughtful technology.
            </motion.p>

            <motion.div
              variants={stagger}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              {visionItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    className={visionCardClass}
                  >
                    <Icon
                      className={`w-16 h-16 p-4 rounded-full ${item.iconClass}`}
                    />
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {item.title}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-7xl mx-auto px-5 py-8">
          <div className="max-w-2xl mx-auto flex flex-col space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Why Choose Us
            </p>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Why families choose us with confidence
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-8">
              We adhere to the highest standards of care and verification to
              ensure your loved ones are always in safe hands.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-10 items-stretch"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))
              : cardData.map((card, index) => (
                  <motion.div key={index} variants={fadeUp} className="h-full">
                    <div className="group relative h-full min-h-60 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-300">
                      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-500 scale-x-0 group-hover:scale-x-100 origin-left transition duration-300" />

                      <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 transition duration-300 group-hover:bg-indigo-500 group-hover:text-slate-100 dark:group-hover:bg-white dark:group-hover:text-blue-600">
                        <card.icon size={22} />
                      </div>

                      <h4 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">
                        {card.name}
                      </h4>

                      <p className="mt-3 text-slate-600 dark:text-slate-400 leading-7">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </section>

        {/* Services */}
        <section className="max-w-7xl mx-auto px-5 py-16">
          <div className="max-w-2xl mx-auto flex flex-col space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Care Services
            </p>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Comprehensive care services at your doorstep
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-8">
              A wide range of professional healthcare services tailored to the
              needs of elderly patients and their families.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-10"
          >
            {serviceItems.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {service}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Professionals */}
        <section className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-5 py-16">
            <div className="max-w-2xl mx-auto flex flex-col space-y-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Our Professionals
              </p>
              <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Meet our trusted professionals
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-8">
                Highly trained, deeply compassionate, and thoroughly verified.
              </p>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10"
            >
              {cardData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 leading-7">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Process */}
        <section className="max-w-7xl mx-auto px-5 py-16">
          <div className="max-w-2xl mx-auto flex flex-col space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              How It Works
            </p>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              A simple and transparent care journey
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-8">
              A clear process to help your family find the right care quickly
              and confidently.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative pt-12"
          >
            <div className="hidden lg:block absolute left-0 right-0 top-22 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />
                      <div className="relative w-20 h-20 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    <p className="mt-4 text-xs font-semibold tracking-[0.25em] uppercase text-blue-600">
                      {step.number}
                    </p>

                    <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400 max-w-55">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 pt-14"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <StatSkeleton key={index} />
                ))
              : stats.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    className="flex items-center justify-center flex-col gap-5 rounded-2xl border border-blue-400/20 bg-blue-500 py-10 px-5 shadow-lg shadow-blue-500/20 hover:-translate-y-1 transition duration-300"
                  >
                    <p className="text-3xl font-bold text-white tracking-tight">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-blue-100 leading-6">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-5 py-16">
          <div className="max-w-2xl mx-auto flex flex-col space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Testimonials
            </p>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              What families say about us
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-8">
              Real stories from families who trusted us with their loved ones’
              care.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10"
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <Quote className="w-8 h-8 text-blue-500" />
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-8">
                  {item.review}
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-5 py-16">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-4xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-8 md:p-12 shadow-sm"
            >
              <motion.div
                variants={fadeUp}
                className="max-w-2xl mx-auto flex flex-col space-y-6 text-center"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Get Started
                </p>
                <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                  Give your loved ones the care they deserve
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-8">
                  Connect with verified professionals today and gain peace of
                  mind for your family.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <NavLink to="/caregivers-login" className="w-full sm:w-fit">
                  <Button className="w-full sm:w-auto px-7 py-4 shadow-lg shadow-blue-500/20">
                    Book a Caregiver
                  </Button>
                </NavLink>

                <NavLink to="/contact" className="w-full sm:w-fit">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-7 py-4 dark:text-slate-100"
                  >
                    Request a Call Back
                  </Button>
                </NavLink>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
