import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import { useEmail, useLoginStep } from "../stores/login";

const VerificationCode = ({
  handleVerificationSuccess,
  handleEmailSubmit,
  userExists,
  isLoading,
}) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [resendDisabled, setResendDisabled] = useState(true);
  const { setStep } = useLoginStep();
  const { email } = useEmail();

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
    <div>
      <form className="relative w-full h-full rounded-[24px] bg-white p-8 shadow-lg h-[450px] w-[370px] lg:h-[584px] lg:w-[474px]">
        <div className="absolute right-4 top-4 cursor-pointer">
          <img
            src="/closeWhiteBg.svg"
            alt="close"
            className="w-8 h-auto"
            onClick={() => navigate(-1)}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <img src="/logo.svg" alt="Logo" className="w-14 h-auto" />
        </div>

        <p className="text-right text-muted lg:text-lg text-md mt-2">
          کد ۴ رقمی فرستاده شده به
          <span
            className="text-primary font-bold inline-block"
            style={{ direction: "ltr", unicodeBidi: "bidi-override" }}
          >
            {email}
          </span>
          را وارد کنید
        </p>

        <div className="flex justify-between my-6 lg:justify-center lg:space-x-10">
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
              className="w-14 h-14 border-[2px] text-center text-2xl border-primary bg-white text-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>
        <p className="text-center text-muted text-lg">
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendDisabled}
          className={`w-full text-secondary bg-white lg:text-lg text-sm border-none lg:mt-4   ${resendDisabled ? "opacity-50" : "hover:text-primary"}`}
        >
          ارسال مجدد کد
        </button>
        <button
          type="submit"
          disabled={code.join("").length < 4}
          className={`w-full py-2 lg:mt-6 mt-2 rounded-md text-white ${
            code.join("").length === 4 ? "bg-primary" : "bg-muted"
          }`}
        >
          تأیید
        </button>

        <div className="flex flex-col items-end mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="text-secondary bg-white lg:text-lg text-sm border-none mb-2 hover:text-primary focus:outline-none"
          >
            تغییر ایمیل
          </button>

          {userExists && (
            <button
              type="button"
              onClick={handleLoginPasswordRedirect}
              className="text-secondary bg-white lg:text-lg text-sm border-none mb-2 hover:text-primary focus:outline-none"
            >
              ورود با رمز عبور
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

VerificationCode.propTypes = {
  handleVerificationSuccess: PropTypes.func.isRequired,
  handleEmailSubmit: PropTypes.func.isRequired,
  userExists: PropTypes.bool.isRequired,
};

export default VerificationCode;
