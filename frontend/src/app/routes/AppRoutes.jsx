import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ROLES } from "../../utils/constants";

import GlobalLoader from "../../components/ui/GlobalLoader";

import PublicRoutes from "./roleRoutes/PublicRoutes";
import UserRoutes from "./roleRoutes/UserRoutes";
import AdminRoutes from "./roleRoutes/AdminRoutes";
import CaregiverRoutes from "./roleRoutes/CaregiverRoutes";

const PublicLayout = lazy(() => import("../../layout/public/PublicLayout"));
const PageNotFound = lazy(
  () => import("../../features/public/pages/PageNotFound"),
);

// AppRoutes.jsx
const AppRoutes = ({ theme, toggleTheme }) => {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <Routes>

        <Route
          element={<PublicLayout theme={theme} toggleTheme={toggleTheme} />}
        >
          {/* Public */}
          {PublicRoutes()}

          {/* User */}
          {UserRoutes()}
          
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* Admin */}
        {AdminRoutes({ theme, toggleTheme })}

        {/* Caregiver */}
        {CaregiverRoutes({ theme, toggleTheme })}

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
