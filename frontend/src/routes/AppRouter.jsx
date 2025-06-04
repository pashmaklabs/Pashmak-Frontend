import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./Routes";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import MapLayout from "../pages/MapLayout";
import NotFound from "../pages/NotFound";
import ProtectedLayout from "./ProtectedLayout";
import Routing from "../pages/Routing";
function AppRouter() {
  return (
    <Routes>
      <Route path={routes.notfound} element={<NotFound />} />
      <Route element={<MapLayout />}>
        <Route path="/" element={<Navigate to={routes.map} replace />} />
        <Route path={routes.map} element={<></>} />
        <Route path={routes.search} element={<></>} />
        <Route path={routes.place} element={<></>} />
        <Route path={routes.dir} element={<></>} />
        <Route path={routes.login} element={<></>} />
        <Route path={routes.changePassword} element={<></>} />
      </Route>
      {/* Protected Route */}
      <Route element={<ProtectedLayout />}>
        <Route path={routes.profile} element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
