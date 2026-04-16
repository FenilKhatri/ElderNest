import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import PageNotFoundImg from "../../assets/images/other/pagenotfound.png";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white px-4">
      <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* LEFT CONTENT */}
        <div className="text-center md:text-left mx-auto max-w-lg">
          {/* 404 Badge */}
          <div className="inline-block px-4 py-1 mb-4 text-sm font-semibold rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40">
            Error 404
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-3 text-blue-500">
            Page <span className="text-[#FF3366]">Not </span>Found
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg">
            The page you’re looking for doesn’t exist or has been moved.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition"
            >
              <Home size={18} />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full max-w-md relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>

          <img
            src={PageNotFoundImg}
            alt="Page not found"
            className="relative w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
