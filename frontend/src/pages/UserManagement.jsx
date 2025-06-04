import { Helmet } from "react-helmet";

const UserManagement = () => {
  return (
    <div className="p-4 flex">
      <Helmet>
        <title>مدیریت کاربران</title>
      </Helmet>
      <h1 className="text-xl font-bold mb-4 text-black">کاربران</h1>
    </div>
  );
};

export default UserManagement;
