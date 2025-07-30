import { Outlet, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import routes from "../routes/Routes";

const AdminLayout = () => {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen h-screen w-screen justify-right items-right"
    >
      <Helmet>
        <title>داشبورد ادمین</title>
      </Helmet>

      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 text-right flex-shrink-0">
        <h1 className="text-2xl font-bold mb-6">پنل مدیریت</h1>
        {/* <NavLink
          to={`${routes.admin}/${routes.admin_locations}`}
          className={({ isActive }) =>
            `mb-2 p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
          }
        >
          پیشنهادهای مکان
        </NavLink>
        <NavLink
          to={`${routes.admin}/${routes.admin_user}`}
          className={({ isActive }) =>
            `mb-2 p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
          }
        >
          مدیریت کاربران
        </NavLink> */}
        <NavLink
          to={`${routes.admin}/${routes.admin_comments}`}
          className={({ isActive }) =>
            `mb-2 p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
          }
        >
          گزارش کامنت‌ها
        </NavLink>
      </aside>

      <main className="flex-1 p-6 bg-gray-50 text-right overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
