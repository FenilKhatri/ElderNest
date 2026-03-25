import { contactItems } from "../../../data/contactPage";

const GetInTouch = () => {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center leading-tight tracking-tight">
        Get in Touch Directly
      </h3>

      <div className="flex items-center md:items-start justify-center md:justify-start gap-5">
        {contactItems?.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className="flex flex-col items-center gap-3" key={index}>
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${item.style}`}
              >
                <a
                  className={`font-bold text-lg ${item.style}`}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              </div>
              <p className="text-slate-500 font-semibold">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GetInTouch;
