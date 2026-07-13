import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useEmail, useLoginStep } from "../stores/login";
import { useNavigate } from "react-router-dom";

const EmailInput = ({ handleEmailSubmit, isLoading, handleCloseLoginFlow }) => {
  const { email, setEmail } = useEmail();
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidEmail) {
      handleEmailSubmit(email);
    }
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsTouched(true);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValidEmail(emailRegex.test(inputEmail));
  };

  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValidEmail(emailRegex.test(email));
    if (email) setIsTouched(true);
  }, [email]);

  const getInputBorderColor = () => {
    if (!isTouched) return "border-gray-200";
    if (isValidEmail) return "border-green-400";
    return "border-red-400";
  };

  const getInputFocusRing = () => {
    if (!isTouched) return "focus:ring-primary/20 focus:border-primary";
    if (isValidEmail) return "focus:ring-green-400/20 focus:border-green-400";
    return "focus:ring-red-400/20 focus:border-red-400";
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="relative rounded-[24px] bg-white shadow-2xl border border-gray-100 w-full max-w-[420px] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleCloseLoginFlow}
          className="bg-transparent border-none absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <img src="/Close_round.svg" alt="close" className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-6 px-8 bg-gradient-to-b from-white">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <img src="/logo.svg" alt="Logo" className="w-20 h-20 mx-auto" />
              <p className="mt-0 text-[#89A4E1] font-Vazir text-lg font-medium">
                پشمک
              </p>
            </div>

            <div className="space-y-2" dir="rtl">
              <h1 className="text-3xl font-bold text-gray-800 font-Vazir">
                ورود
              </h1>
              <p className="text-gray-600 text-base font-Vazir">
                سفرتو شروع کن...
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          <div className="space-y-6">
            {/* Email Input Section */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 text-right"
              >
                ایمیل
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="ایمیل خود را وارد کنید"
                  className={`w-full px-4 py-4 text-right text-gray-800 border-2 rounded-xl bg-gray-50 
                            placeholder:text-gray-400 transition-all duration-200
                            focus:outline-none focus:ring-4 focus:bg-white
                            hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed
                            ${getInputBorderColor()} ${getInputFocusRing()}`}
                  disabled={isLoading}
                  required
                />

                {/* Email Validation Icon */}
                {isTouched && email && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    {isValidEmail ? (
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {isTouched && !isValidEmail && email.length > 0 && (
                <div className="flex items-center gap-2 text-red-600 text-sm text-right">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>لطفا یک ایمیل معتبر وارد کنید</span>
                </div>
              )}
            </div>

            <div className="flex justify-center my-4 min-h-[80px]">
              <div 
                className="arcaptcha" 
                data-site-key="0yr90ks5fa" 
                data-theme="light"
                data-lang="fa"
              ></div>
            </div>





            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValidEmail || isLoading}
              className={`w-full py-4 px-6 rounded-xl font-medium text-white 
                        transition-all duration-200 transform
                        ${
                          isValidEmail
                            ? "bg-primary hover:bg-primary/90 hover:scale-[0.99] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            : "bg-gray-300 cursor-not-allowed"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>در حال پردازش...</span>
                </div>
              ) : (
                "ورود"
              )}
            </button>

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>با وارد کردن ایمیل، کد تأیید برای شما ارسال می‌شود</p>
            </div>
          </div>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[24px]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">در حال ارسال کد...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

EmailInput.propTypes = {
  handleEmailSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  handleCloseLoginFlow: PropTypes.func.isRequired,
};

export default EmailInput;
