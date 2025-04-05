import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import routes from "../routes/Routes";
import { useLoginStep } from "../stores/login";

const PasswordLogin = ({ handlePasswordLoginSuccess, setUserExists }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setStep } = useLoginStep();
  const handleSubmit = (e) => {
    e.preventDefault();
    handlePasswordLoginSuccess();
  };

  const handleForgetPasswordClick = () => {
    navigate(routes.changePassword);
  };

  const handleBackToVerification = () => {
    setUserExists(true);
    setStep("verification");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full rounded-[24px] bg-white p-8 shadow-lg lg:h-[584px] lg:w-[474px]"
      >
        <div className="flex justify-between items-center mb-6">
          <img src="/logo.svg" alt="Logo" className="w-14 h-auto" />
        </div>
        <h2 className="mt-12 mb-2 text-right font-Vazir text-5xl text-primary">
          ورود
        </h2>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="rtl"
            placeholder="رمز عبور خود را وارد کنید"
            className={`mt-6 w-full rounded-md border-[2px] bg-white px-4 py-2 text-secondary placeholder:text-right focus:outline-none p-10 pl-12 focus:border-primary`}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-2/3 transform -translate-y-1/2 cursor-pointer text-xl text-primary"
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5 text-primary" />
            ) : (
              <EyeIcon className="w-5 h-5 text-primary" />
            )}
          </span>
        </div>

        <button
          type="submit"
          className={`w-full py-2 mt-6 rounded-md text-white ${password ? "bg-primary" : "bg-muted"}`}
          disabled={!password}
        >
          ورود
        </button>

        <div className="flex flex-col items-end mt-6">
          <button
            type="button"
            onClick={handleBackToVerification}
            className="text-secondary bg-white text-lg border-none mb-2 hover:text-primary focus:outline-none"
          >
            ورود با رمز یکبار مصرف
          </button>
          <button
            type="button"
            onClick={handleForgetPasswordClick}
            className="text-secondary bg-white text-lg border-none mb-2 hover:text-primary focus:outline-none"
          >
            فراموشی رمز عبور
          </button>
        </div>
      </form>
    </div>
  );
};

PasswordLogin.propTypes = {
  handlePasswordLoginSuccess: PropTypes.func.isRequired,
  setUserExists: PropTypes.func,
};

export default PasswordLogin;
