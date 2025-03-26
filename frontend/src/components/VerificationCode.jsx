import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import { useLoginStep } from "../stores/login";

const VerificationCode = ({
  handleEmailSubmit,
  handleVerificationSuccess,
  userExists,
  isLoading,
}) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [resendDisabled, setResendDisabled] = useState(true);
  const { setStep } = useLoginStep();

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

    if (value && index < code.length - 1) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput?.focus();
    }
    if (!value && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`);
      prevInput?.focus();
    }
  };

  useEffect(() => {
    if (code.join("").length === 4) {
      handleVerificationSuccess(code.join(""));
    }
  }, [code]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (code.join("").length === 4) {
  //     console.log("the otp is `" + code.join("") + "`")
  //     handleVerificationSuccess(code.join(""));
  //   }
  // };

  const handleBack = () => {
    navigate(routes.login);
    setStep("email");
  };
  const handleClick = () => {
    handleEmailSubmit("");
    setCode(["", "", "", ""]);
    const nextInput = document.getElementById(`input-0`);
    nextInput?.focus();
    setTimeLeft(90);
    setResendDisabled(true);
  };
  return (
    <div>
      <form
        // onSubmit={handleSubmit}
        className="w-full h-full rounded-lg bg-white p-8 shadow-lg lg:h-[584px] lg:w-[474px]"
      >
        <div className="flex justify-between items-center mb-6">
          <img src="/logo.svg" alt="Logo" className="w-14 h-auto" />
        </div>

        <p className="text-right text-muted text-lg mt-2">
          کد ۴ رقمی فرستاده شده به
          <span
            className="text-primary font-bold inline-block"
            style={{ direction: "ltr", unicodeBidi: "bidi-override" }}
          >
            {email}
          </span>
          را وارد کنید
        </p>

        <div className="flex justify-between my-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
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
          onClick={handleClick}
          disabled={resendDisabled}
          className={`w-full text-secondary bg-white text-lg border-none mt-4  ${resendDisabled ? "opacity-50" : "hover:text-primary"}`}
        >
          ارسال مجدد کد
        </button>
        <button
          type="submit"
          disabled={code.join("").length < 4}
          className={`w-full py-2 mt-6 rounded-md text-white ${
            code.join("").length === 4 ? "bg-primary" : "bg-muted"
          }`}
        >
          تأیید
        </button>

        <div className="flex flex-col items-end mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="text-secondary bg-white text-lg border-none mb-2 hover:text-primary focus:outline-none"
          >
            تغییر ایمیل
          </button>

          {userExists && (
            <button
              type="button"
              onClick={handleLoginPasswordRedirect}
              className="text-secondary bg-white text-lg border-none mb-2 hover:text-primary focus:outline-none"
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
  userExists: PropTypes.bool.isRequired,
};

export default VerificationCode;
