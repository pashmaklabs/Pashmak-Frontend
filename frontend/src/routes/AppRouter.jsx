import { Routes, Route } from "react-router-dom";
import routes from "./Routes";
import Login from "../pages/Login";
import ChangePassword from "../pages/ChangePassword";
import CompleteProfile from "../pages/CompleteProfile";
import Map from "../pages/Map";
import Profile from "../pages/Profile";

function AppRouter() {
  return (
    <Routes>
      <Route path={routes.login} element={<Login />} />
      <Route path={routes.changePassword} element={<ChangePassword />} />
      <Route path={routes.completeProfile} element={<CompleteProfile />} />
      <Route path={routes.map} element={<Map />} />
      <Route path={routes.profile} element={<Profile />} />

    </Routes>
  );
}

export default AppRouter;
