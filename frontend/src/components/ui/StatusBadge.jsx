import { getStatusColor, capitalize } from "../../utils/helpers";

const StatusBadge = ({ status, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )} ${className}`}
    >
      {capitalize(status?.replace("-", " "))}
    </span>
  );
};

export default StatusBadge;
