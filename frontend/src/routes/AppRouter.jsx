import { Routes, Route } from "react-router-dom";
import routes from "./Routes";
import Login from "../pages/Login";
import ChangePassword from "../pages/ChangePassword";
import Profile from "../pages/Profile";
import MapLayout from "../pages/MapLayout";
import NotFound from "../pages/NotFound";
import ProtectedLayout from "./ProtectedLayout";
function AppRouter() {
  return (
    <Routes>
      <Route path={routes.login} element={<Login />} />
      <Route path={routes.changePassword} element={<ChangePassword />} />
      <Route path={routes.notfound} element={<NotFound />} />
      <Route element={<MapLayout />}>
        <Route path={routes.map} element={<></>} />
        <Route path={routes.search} element={<></>} />
        <Route path={routes.place} element={<></>} />
      </Route>
      {/* Protected Route */}
      <Route element={<ProtectedLayout />}>
        <Route path={routes.profile} element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
