import { Link } from "react-router-dom";

const FooterSection = ({ title, links, linkClass }) => {
  return (
    <div className="col-span-1 flex flex-col gap-5 items-start justify-start">
      <p className="font-bold text-slate-800 dark:text-slate-100">{title}</p>

      <ul className="space-y-3">
        {links?.map((item) => (
          <li key={item?.path}>
            <Link to={item?.path} className={linkClass}>
              {item?.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterSection;