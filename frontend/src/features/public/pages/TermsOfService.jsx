import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../../../animations/motionVariants";
import { sections } from "../data/termsOfServiceData";

const TermsOfService = () => {
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
      el.scrollIntoView({ behavior: "smooth", block: "start" });
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
          className="max-w-site-wide mx-auto"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF3366] dark:text-[#ff6b8f] mb-3">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a6e] dark:text-white leading-tight">
            Terms of Service
          </h1>
        </motion.div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-site-wide mx-auto px-4 py-10 flex gap-10 items-start">
        {/* Sticky Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24 self-start">
          <nav className="space-y-1.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 leading-snug group
                    ${
                      isActive
                        ? "text-[#1a1a6e] dark:text-white font-semibold bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
                        : "text-slate-500 dark:text-slate-400 hover:text-[#1a1a6e] dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60 border border-transparent"
                    }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-[#FF3366]/10 text-[#FF3366]" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-[#FF3366] group-hover:bg-[#FF3366]/5"
                  }`}>
                    {Icon && <Icon className="w-4 h-4" />}
                  </div>
                  <span>{section.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
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
              <div className="text-sm md:text-lg leading-relaxed space-y-4 [&_h3]:text-[#1a1a6e] [&_h3]:dark:text-white [&_h3]:font-bold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-slate-600 [&_p]:dark:text-slate-400">
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

export default TermsOfService;
