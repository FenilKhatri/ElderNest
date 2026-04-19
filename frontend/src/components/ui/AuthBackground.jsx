import H3 from "./H3";
import Avatar from "../../assets/images/other/authbg.avif";

const AuthBackground = ({
  PersonName,
  AuthBG,
  Description,
  PersonDesignation,
}) => {
  return (
    <div className="hidden md:flex w-1/2 items-center justify-center">
      <div className="w-full h-full relative">
        {/* Image */}
        <img
          src={AuthBG}
          alt="Auth BG"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width="full"
          height="full"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-black/80 to-black/50"></div>

        {/* Text */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <H3 className="text-lg font-medium leading-relaxed max-w-lg text-justify text-white">
            “{Description}”
          </H3>

          <div className="flex items-center gap-3 mt-4">
            <img
              src={Avatar}
              className="object-contain rounded-full"
              width={50}
              height={50}
              loading="lazy"
              decoding="async"
            />
            <div>
              <p className="text-sm font-semibold">{PersonName}</p>
              <p className="text-xs text-slate-300">{PersonDesignation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBackground;
