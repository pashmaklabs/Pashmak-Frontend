import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import { useEmail, useLoginStep } from "../stores/login";
import { toPersianDigits } from "../utils/persianNumber";

const VerificationCode = ({
  handleVerificationSuccess,
  handleEmailSubmit,
  userExists,
  isLoading,
  handleCloseLoginFlow,
}) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [resendDisabled, setResendDisabled] = useState(true);
  const { setStep } = useLoginStep();
  const { email, setEmail } = useEmail();

  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [timeLeft]);

  const handleLoginPasswordRedirect = () => {
    setStep("password");
    navigate(routes.login);
  };

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (newCode.join("").length === 4) {
      handleVerificationSuccess(newCode.join(""));
    }

    if (value && index < code.length - 1) {
      document.getElementById(`input-${index + 1}`)?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key !== "Backspace") return;

    const newCode = [...code];

    if (code[index]) {
      newCode[index] = "";
      setCode(newCode);
    } else if (index > 0) {
      newCode[index - 1] = "";
      setCode(newCode);
      const prevInput = document.getElementById(`input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (pastedText.length === 4) {
      setCode([...pastedText.split("")]);
      document.getElementById(`input-3`)?.focus();
      handleVerificationSuccess(pastedText);
    }
  };

  const handleBack = () => {
    navigate(routes.login);
    setStep("email");
  };

  const handleResendCode = (e) => {
    e.preventDefault();
    handleEmailSubmit(email);
    setCode(["", "", "", ""]);
    document.getElementById(`input-0`)?.focus();
    setTimeLeft(90);
    setResendDisabled(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="relative rounded-[24px] bg-white shadow-2xl border border-gray-100 max-w-[420px] overflow-hidden sm:w-[370px] sm:h-auto lg:h-auto lg:w-[474px]">
        {/* Close Button */}
        <button
          onClick={handleCloseLoginFlow}
          className="bg-transparent border-none absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <img src="/Close_round.svg" alt="close" className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-6 px-8 bg-white relative">
          {/* Logo in top left */}
          <div className="absolute top-4 left-8">
            <img src="/logo.svg" alt="Logo" className="w-12 h-12" />
          </div>

          <div className="flex flex-col items-center text-center pt-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                تأیید کد ورود
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                کد ۴ رقمی فرستاده شده به ایمیل زیر را وارد کنید
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
        <div className="px-8 pb-8">
          {/* Code Input */}
          <div className="flex justify-center gap-3 mb-8 mt-1">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(e, index)}
                onPaste={handlePaste}
                className="w-14 text-gray-700 h-14 border-2 border-gray-200 text-center text-2xl font-bold rounded-xl 
                          focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none 
                          transition-all font-Vazir duration-200 bg-gray-50 hover:bg-white
                          hover:border-gray-300"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Timer and Resend Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="font-Vazir text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg w-14">
                {toPersianDigits(Math.floor(timeLeft / 60))}:
                {toPersianDigits((timeLeft % 60).toString().padStart(2, "0"))}
              </span>
              <span className="text-gray-500 text-sm" dir="rtl">
                زمان باقی‌مانده:
              </span>
            </div>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendDisabled || isLoading}
              className={`bg-white text-sm font-medium transition-all duration-200 ${
                resendDisabled || isLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary hover:text-primary/80 hover:underline"
              }`}
            >
              {isLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {userExists && (
              <button
                type="button"
                onClick={handleLoginPasswordRedirect}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 
                          rounded-xl font-medium transition-colors duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ورود با رمز عبور
              </button>
            )}

            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="bg-white w-full py-3 px-4 text-primary hover:bg-primary/5 
                        rounded-xl font-medium transition-colors duration-200 
                        flex items-center justify-center gap-2
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>◀</span>
              <span>تغییر ایمیل</span>
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[24px]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">در حال بررسی...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

VerificationCode.propTypes = {
  handleVerificationSuccess: PropTypes.func.isRequired,
  handleEmailSubmit: PropTypes.func.isRequired,
  userExists: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  handleCloseLoginFlow: PropTypes.func.isRequired,
};

export default VerificationCode;
