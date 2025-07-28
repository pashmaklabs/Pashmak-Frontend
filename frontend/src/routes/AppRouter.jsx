import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./Routes";
import Profile from "../pages/Profile";
import MapLayout from "../pages/MapLayout";
import NotFound from "../pages/NotFound";
import ProtectedLayout from "./ProtectedLayout";

import AdminLayout from "../pages/AdminLayout";
import LocationSuggestions from "../pages/LocationSuggestions";
import UserManagement from "../pages/UserManagement";
import CommentReports from "../pages/CommentReports";
import { useRole } from "../stores/login";

function AppRouter() {
  const { role } = useRole();
  return (
    <Routes>
      <Route path={routes.notfound} element={<NotFound />} />
      <Route element={<MapLayout />}>
        <Route path="/" element={<Navigate to={routes.map} replace />} />
        <Route path={routes.map} element={<></>} />
        <Route path={routes.search} element={<></>} />
        <Route path={routes.place} element={<></>} />
        <Route path={routes.bookmarks} element={<></>} />
        <Route path={routes.dir} element={<></>} />
        <Route path={routes.login} element={<></>} />
        <Route path={routes.changePassword} element={<></>} />
        <Route path={routes.searchHistory} element={<></>} />
        <Route element={<ProtectedLayout />}>
          <Route path={routes.profile} element={<></>} />
        </Route>
      </Route>
      {role === "admin" && (
        <Route path={routes.admin} element={<AdminLayout />}>
          <Route index element={<LocationSuggestions />} />
          <Route
            path={routes.admin_locations}
            element={<LocationSuggestions />}
          />
          <Route path={routes.admin_user} element={<UserManagement />} />
          <Route path={routes.admin_comments} element={<CommentReports />} />
        </Route>
      )}
    </Routes>
  );
}

export default AppRouter;
