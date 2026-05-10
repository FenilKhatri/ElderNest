import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "./Button";

const LogoutButton = ({ showText = true, className = "" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, y: 0 });
  const wrapperRef = useRef(null);

  const handleLogout = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    if (showText) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) setTooltip({ show: true, y: rect.top + rect.height / 2 });
  };

  const handleMouseLeave = () => setTooltip({ show: false, y: 0 });

  return (
    <>
      {/* Portal tooltip */}
      {!showText &&
        tooltip.show &&
        createPortal(
          <div
            className="fixed left-18 z-9999 flex items-center pointer-events-none"
            style={{ top: `${tooltip.y}px`, transform: "translateY(-50%)" }}
          >
            {/* Arrow */}
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-10 border-r-slate-700" />

            {/* Card */}
            <div className="flex items-center gap-3 bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl whitespace-nowrap">
              <LogOut size={18} className="text-red-400" />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </div>
          </div>,
          document.body,
        )}

      <div
        ref={wrapperRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button
          onClick={handleLogout}
          variant="danger"
          disabled={loading}
          className={`
            w-full flex items-center justify-center gap-2
            ${loading ? "cursor-not-allowed opacity-70" : ""}
            ${className}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              {showText && "Logging out..."}
            </>
          ) : (
            <>
              <LogOut size={18} />
              {showText && "Logout"}
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default LogoutButton;
