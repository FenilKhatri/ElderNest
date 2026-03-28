import LoginBGDarkImg from "../../../assets/images/Other/LoginSignUpBG.png";

const LoginBG = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden rounded-3xl">
      {/* 🌈 Background Gradient Layer */}
      <div
        className="absolute inset-0 bg-linear-to-r 
        from-white/80 via-white/40 to-transparent 
        dark:from-transparent dark:via-slate-800/40 dark:to-slate-900/10 z-1"
      />

      {/* 🌌 Dark Mode Image */}
      <img
        src={LoginBGDarkImg}
        alt="Login BG"
        className="absolute top-1/2 right-0 -translate-y-1/2 
        w-125 h-125 object-cover opacity-70 blur-[2px]"
      />

      {/* ✨ Content */}
      <div
        className="relative z-10 h-full flex flex-col justify-center 
        items-center text-center md:items-start md:text-left px-6 md:px-16"
      >
        <div className="max-w-lg animate-[fadeIn_0.8s_ease-in-out]">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
            Smart Care.
            <br />
            <span className="text-3xl md:text-4xl text-slate-700 dark:text-slate-300">
              Trusted Hands.
            </span>
          </h1>

          <p
            className="mt-6 text-lg text-slate-600 dark:text-slate-300 
            bg-white/40 dark:bg-slate-800/40 backdrop-blur-md 
            px-4 py-3 rounded-lg leading-relaxed"
          >
            Connecting families with verified caregivers, seamlessly.
          </p>
        </div>
      </div>

      {/* 🏷️ Bottom Badges */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 
        md:left-10 md:translate-x-0 flex flex-wrap gap-4 z-10"
      >
        {/* Badge 1 */}
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-full 
          border border-slate-300 dark:border-slate-700 
          bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-md"
        >
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>

          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Secure & Encrypted
          </span>
        </div>

        {/* Badge 2 */}
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-full 
          border border-slate-300 dark:border-slate-700 
          bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-md"
        >
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Verified Platform
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginBG;
