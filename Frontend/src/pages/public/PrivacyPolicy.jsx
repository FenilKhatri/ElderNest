import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import privacyData from "../../data/privacyData";

const PrivacyPolicy = () => {
  // State to track the active section for the sidebar highlight
  const [activeSection, setActiveSection] = useState("acceptance");

  // Navigation items

  // Helper function to handle smooth scrolling
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Adjusted offset for mobile vs desktop headers
      const offset = window.innerWidth < 1024 ? 140 : 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A101E] font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Header Section */}
      <div className="w-full flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center border-b border-slate-800/50 bg-linear-to-b dark:from-[#0A101E] dark:to-[#0D1527] from-slate-100 to-slate-200">
        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-900/50 dark:bg-slate-950/30 bg-slate-100 text-blue-400 mb-8 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide uppercase">
            Legal & Complaince
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-800 mb-6 tracking-tight">
          Privacy Policy
        </h1>

        {/* Subtitle */}
        <p className="text-slate-500 text-sm md:text-base max-w-xl leading-relaxed">
          Effective Date: March 28, 2026 • Last Updated: March 28, 2026
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="bg-slate-100 dark:bg-transparent ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-20">
          {/* Navigation - Horizontal on Mobile, Vertical Sticky on Desktop */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="sticky top-20 z-20 bg-[#0A101E]/95 backdrop-blur-sm lg:bg-transparent py-4 lg:py-0 border-b border-slate-800/50 lg:border-none -mx-4 px-4 lg:mx-0 lg:px-0">
              <h3 className="hidden lg:block text-xs font-bold text-blue-500 dark:text-slate-500 tracking-[0.15em] uppercase mb-4 px-4">
                Contents
              </h3>

              {/* Scrollable container for mobile */}
              <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-1 pb-2 lg:pb-0 hide-scrollbar snap-x">
                {privacyData.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`whitespace-nowrap lg:whitespace-normal text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 snap-start shrink-0 lg:shrink ${
                      activeSection === item.id
                        ? "dark:bg-[#111C35] text-blue-500 shadow-sm"
                        : "text-blue-300 hover:bg-slate-100/30 hover:text-blue-500 cursor-pointer"
                    }`}
                  >
                    {item?.number}
                    {". "}
                    {item?.id}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 w-full max-w-3xl space-y-8 pb-24 text-[15px] leading-relaxed">
            {privacyData?.map((privacy) => (
              <section
                id={privacy?.id}
                key={privacy?.number}
                className="scroll-mt-32 lg:scroll-mt-24 text-slate-600 dark:text-slate-300"
              >
                {/* Premium Section Heading */}
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-baseline gap-3 tracking-tight">
                  <span className="text-indigo-600 dark:text-indigo-400 font-black text-2xl md:text-3xl">
                    {privacy?.number}.
                  </span>
                  {privacy?.title}
                </h2>

                {/* Section Content */}
                <div className="space-y-4">
                  {privacy?.content?.map((data, index) => (
                    <div key={index}>
                      {data?.type === "paragraph" && (
                        <p className="leading-loose text-slate-600 dark:text-slate-300">
                          {data?.text}
                        </p>
                      )}

                      {data?.type === "callout" && (
                        <div className="relative overflow-hidden p-5 md:p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 shadow-sm mt-2">
                          {/* Subtle left accent bar */}
                          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 dark:bg-indigo-400 rounded-l-2xl"></div>
                          <p className="text-[15px] font-medium text-indigo-900 dark:text-indigo-200 leading-relaxed">
                            {data?.text}
                          </p>
                        </div>
                      )}

                      {data?.type === "list" && (
                        <ul className="list-disc list-outside ml-6 space-y-2 marker:text-indigo-500 dark:marker:text-indigo-400 text-slate-600 dark:text-slate-300 mt-2">
                          {data?.items?.map((item, idx) => (
                            <li key={idx} className="pl-2 leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {!["paragraph", "callout", "list", "contact"].includes(
                        data?.type,
                      ) && (
                        <div className="flex flex-col items-start mt-6">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            {data?.heading}
                          </h3>
                          <p className="leading-loose text-slate-600 dark:text-slate-300">
                            {data?.text}
                          </p>
                        </div>
                      )}

                      {data?.type === "contact" && (
                        <div className="space-y-2">
                          {data?.items?.map((item, i) => (
                            <p key={i}>
                              <span className="font-medium dark:text-slate-100 text-slate-800">
                                {item.label}:{" "}
                              </span>

                              {item.label === "Email" ? (
                                <a
                                  href={`mailto:${item.value}`}
                                  className="text-blue-400 hover:text-[#FF3366] hover:underline transition duration-300"
                                >
                                  {item.value}
                                </a>
                              ) : item.label === "Phone" ? (
                                <a
                                  href={`tel:${item.value}`}
                                  className="text-blue-400 hover:text-[#FF3366] hover:underline transition duration-300"
                                >
                                  {item.value}
                                </a>
                              ) : (
                                <span>{item.value}</span>
                              )}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
