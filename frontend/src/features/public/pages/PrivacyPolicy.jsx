import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../../../animations/motionVariants";
import { sections } from "../data/privacyPolicyData";
import Button from "../../../components/ui/Button";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#eef0f8] dark:bg-slate-950">
      {/* Hero */}
      <div className="bg-[#eef0f8] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-14 px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF3366] dark:text-[#ff6b8f] mb-3">
            Legal
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a6e] dark:text-white leading-tight">
            Privacy Policy
          </h1>
        </motion.div>
      </div>

      {/* Layout */}
      <div className="max-w-5xl mx-auto px-4 py-10 flex gap-10 items-start">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
          <nav className="space-y-1">
            {sections.map((section) => (
              <Button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 leading-snug
                ${
                  activeSection === section.id
                    ? "text-[#1a1a6e] dark:text-white font-semibold border-l-2 border-[#FF3366] pl-4 bg-white dark:bg-slate-800/60"
                    : "text-slate-500 dark:text-slate-400 hover:text-[#1a1a6e] dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/40"
                }`}
              >
                {section.title}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-16">
          {sections.map((section, i) => (
            <motion.section
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="scroll-mt-24"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1a6e] dark:text-white leading-tight mb-5">
                {section.title}
              </h2>

              <div className="text-[15px] leading-relaxed space-y-4 [&_h3]:text-[#1a1a6e] [&_h3]:dark:text-white [&_h3]:font-bold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-slate-600 [&_p]:dark:text-slate-400">
                {section.content}
              </div>

              {i < sections.length - 1 && (
                <div className="mt-16 border-b border-slate-200 dark:border-slate-800" />
              )}
            </motion.section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;