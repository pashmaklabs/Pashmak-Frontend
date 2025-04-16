import { Routes, Route } from "react-router-dom";
import routes from "./Routes";
import Login from "../pages/Login";
import ChangePassword from "../pages/ChangePassword";
import CompleteProfile from "../pages/CompleteProfile";
import Profile from "../pages/Profile";
import MapLayout from "../pages/MapLayout";

function AppRouter() {
  return (
    <Routes>
      <Route path={routes.login} element={<Login />} />
      <Route path={routes.changePassword} element={<ChangePassword />} />
      <Route path={routes.completeProfile} element={<CompleteProfile />} />
      <Route path={routes.profile} element={<Profile />} />
      <Route element={<MapLayout />}>
        <Route path={routes.map} element={<></>} />
        <Route path={routes.search} element={<></>} />
        <Route path={routes.place} element={<></>} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
