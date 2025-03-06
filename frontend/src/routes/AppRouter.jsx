import { Routes, Route } from "react-router-dom";
import routes from "./Routes";  
import Login from "../pages/Login";  
import ForgetPassword from "../pages/ForgetPassword"; 


function AppRouter() {
  return (
    <Routes>
      <Route path={routes.login} element={<Login />} />  
      <Route path={routes.ForgetPassword} element={<ForgetPassword />}/>
    </Routes>
  );
}

export default AppRouter;