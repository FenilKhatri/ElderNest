import { features } from "../../../data/pages/homeData";

const WhyChooseUs = () => {
  return (
    <section className="py-14 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
          Why Choose ElderNest?
        </h2>

        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Trusted elder care services at home across Gujarat. We connect
          families with professional caregivers, nurses, and healthcare experts
          for safe and compassionate care.
        </p>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features?.map((item, index) => {
            const Icon = item?.icon;

            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto ${item?.theme}`}
                >
                  <Icon />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
                  {item?.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-6">
                  {item?.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
