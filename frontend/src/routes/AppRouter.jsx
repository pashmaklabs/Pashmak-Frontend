import { Routes, Route } from "react-router-dom";
import routes from "./Routes";  
import Login from "../pages/Login";  
import SignupPage from "../pages/SignupPage"; 
import ChangePassword from "../pages/ChangePassword"; 


function AppRouter() {
  return (
    <Routes>
      <Route path={routes.login} element={<Login />} />  
      <Route path={routes.change_password} element={<ChangePassword />}/>
      <Route path={routes.signup} element={<SignupPage />} />  
    </Routes>
  );
}

export default AppRouter;