import ContactBG1 from "../../../assets/images/Other/contactBG1.png";
import ContactBG2 from "../../../assets/images/Other/contactBG2.png";

const FormBG = () => {
  return (
    <>
      {/* Desktop */}
      <div className="relative hidden md:flex items-center justify-center w-105 h-105 mx-auto">
        {/* Glow Layer (outer soft glow) */}
        <div className="absolute h-95 w-95 rounded-full bg-blue-500/20 blur-3xl dark:bg-cyan-400/20" />

        {/* Gradient Ring 1 */}
        <div className="absolute h-85 w-85 rounded-full bg-linear-to-b from-blue-500/30 via-blue-200/20 to-transparent dark:from-cyan-500/30 dark:via-cyan-200/10 dark:to-transparent" />

        {/* Gradient Ring 2 */}
        <div className="absolute h-65 w-65 rounded-full bg-linear-to-b from-blue-400/40 via-blue-200/20 to-transparent dark:from-cyan-400/40 dark:via-cyan-200/10 dark:to-transparent" />

        {/* Inner Glow */}
        <div className="absolute h-45 w-45 rounded-full bg-blue-300/30 blur-2xl dark:bg-cyan-300/20" />

        {/* Image Circle */}
        <div className="relative z-10 w-100 h-100 rounded-full overflow-hidden shadow-xl shadow-blue-500/20 dark:shadow-cyan-500/20">
          <img
            src={ContactBG1}
            alt="Contact"
            loading="lazy"
            height="full"
            width="full"
            decoding="async"
            className="w-full h-full object-cover object-top scale-125 translate-y-6"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="relative md:hidden flex justify-center items-center w-full py-6 overflow-hidden">
        {/* Half circle layer 1 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-65 h-65 rounded-t-full bg-linear-to-t from-blue-500/30 to-transparent dark:from-cyan-400/25 dark:to-transparent" />

        {/* Half circle layer 2 */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-52.5 h-52 rounded-t-full bg-linear-to-t from-blue-400/25 to-transparent dark:from-cyan-300/20 dark:to-transparent" />

        {/* Half circle layer 3 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-40 rounded-t-full bg-linear-to-t from-blue-300/20 to-transparent dark:from-cyan-200/15 dark:to-transparent" />

        {/* Mobile image */}
        <div className="relative z-10 w-60 h-60 mx-auto">
          <img
            src={ContactBG2}
            alt="Contact BG"
            height="full"
            width="full"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top scale-125"
          />
        </div>
      </div>
    </>
  );
};

export default FormBG;