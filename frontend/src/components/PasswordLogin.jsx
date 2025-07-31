import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import routes from "../routes/Routes";
import { useLoginStep, useEmail } from "../stores/login";

const PasswordLogin = ({
  handlePasswordLoginSuccess,
  setUserExists,
  isLoading,
  handleCloseLoginFlow,
  handleEmailSubmit,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const navigate = useNavigate();
  const { setStep } = useLoginStep();
  const { email } = useEmail();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      handlePasswordLoginSuccess(password);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsTouched(true);
  };

  const handleForgetPasswordClick = () => {
    setStep("verification");
    navigate(routes.changePassword);
  };

  const handleBackToVerification = () => {
    handleEmailSubmit(email);
    setUserExists(true);
    setStep("verification");
  };

  const isValidPassword = password.trim().length >= 1;

  const getInputBorderColor = () => {
    if (!isTouched) return "border-gray-200";
    if (isValidPassword) return "border-green-400";
    return "border-gray-200";
  };

  const getInputFocusRing = () => {
    return "focus:ring-primary/20 focus:border-primary";
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="relative rounded-[24px] bg-white shadow-2xl border border-gray-100 w-full max-w-[420px] overflow-hidden lg:h-[580px] lg:w-[474px]">
        {/* Close Button */}
        <button
          onClick={handleCloseLoginFlow}
          className="bg-transparent border-none absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <img src="/Close_round.svg" alt="close" className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <div className="absolute top-4 left-8">
            <img src="/logo.svg" alt="Logo" className="w-12 h-12" />
          </div>

          <div className="pt-12 pb-6 px-8 bg-white">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                ورود با رمز عبور
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                رمز عبور خود را برای ایمیل زیر وارد کنید
              </p>
              <div
                className="inline-block px-3 py-1 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium"
                style={{ direction: "ltr", unicodeBidi: "bidi-override" }}
              >
                {email}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-6">
            {/* Password Input Section */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 text-right"
              >
                رمز عبور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="رمز عبور خود را وارد کنید"
                  className={`w-full px-4 py-4 pr-4 pl-12 text-right border-2 rounded-xl bg-gray-50 
                            placeholder:text-gray-400 transition-all duration-200
                            focus:outline-none focus:ring-4 focus:bg-white
                            hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed
                            ${getInputBorderColor()} ${getInputFocusRing()}`}
                  disabled={isLoading}
                  required
                />

                {/* Password Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-transparent absolute left-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValidPassword || isLoading}
              className={`w-full py-4 px-6 rounded-xl font-medium text-white 
                        transition-all duration-200 transform
                        ${
                          isValidPassword
                            ? "bg-primary hover:bg-primary/90 hover:scale-[0.99] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            : "bg-gray-300 cursor-not-allowed"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>در حال ورود...</span>
                </div>
              ) : (
                "ورود"
              )}
            </button>

            {/* Alternative Options */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleBackToVerification}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 
                          rounded-xl font-medium transition-colors duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ورود با رمز یکبار مصرف
              </button>

              <button
                type="button"
                onClick={handleForgetPasswordClick}
                disabled={isLoading}
                className="bg-transparent w-full py-3 px-4 text-primary hover:bg-primary/5 
                          rounded-xl font-medium transition-colors duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                فراموشی رمز عبور
              </button>
            </div>

            {/* Security Note */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>رمز عبور شما به صورت امن ذخیره و پردازش می‌شود</p>
            </div>
          </div>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[24px]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">در حال احراز هویت...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PasswordLogin.propTypes = {
  handlePasswordLoginSuccess: PropTypes.func.isRequired,
  setUserExists: PropTypes.func,
  isLoading: PropTypes.bool,
  handleCloseLoginFlow: PropTypes.func.isRequired,
};

export default PasswordLogin;
