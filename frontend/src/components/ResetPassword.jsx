import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";

const ResetPassword = ({ handleChangePassword }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(true);
  const [confirmPasswordError, setConfirmPasswordError] = useState(true);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordError && !confirmPasswordError) {
      handleChangePassword();
    }
  };

  const handleGoBack = () => {
    navigate(routes.map);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = {
      minLength: {
        message: "رمز عبور باید حداقل 8 کاراکتر باشد",
        isError: password.length < minLength,
      },
      hasUpperCase: {
        message: "رمز عبور باید حداقل یک حرف بزرگ داشته باشد",
        isError: !hasUpperCase,
      },
      hasNumber: {
        message: "رمز عبور باید حداقل یک رقم داشته باشد",
        isError: !hasNumber,
      },
      hasSpecialChar: {
        message: "رمز عبور باید حداقل یک کاراکتر خاص داشته باشد",
        isError: !hasSpecialChar,
      },
    };

    const hasError = Object.values(errors).some((error) => error.isError);
    setPasswordError(hasError);
    setPasswordErrors(errors);
  };

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);
    validatePassword(inputPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const inputConfirmPassword = e.target.value;
    setConfirmPassword(inputConfirmPassword);

    if (inputConfirmPassword === password) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  };

  useEffect(() => {
    if (confirmPassword === password) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  }, [password, confirmPassword]);

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full rounded-lg bg-white p-8 shadow-lg lg:h-[584px] lg:w-[474px]"
      >
        <div className="flex justify-between items-center mb-6">
          <img src="/logo.svg" alt="Logo" className="w-14 h-auto" />
          <button
            type="button"
            onClick={handleGoBack}
            className="text-secondary bg-white text-lg border-none mb-2 hover:text-primary focus:outline-none"
          >
            خروج
          </button>
        </div>

        <h2 className="mt-12 mb-2 text-right font-Vazir text-5xl text-primary">
          تنظیم رمز عبور
        </h2>
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            dir="rtl"
            onFocus={() => setPasswordTouched(true)}
            onBlur={() => setPasswordTouched(false)}
            placeholder="رمز عبور جدید را وارد کنید"
            className={`mt-6 w-full rounded-md border-[3px] bg-white px-4 py-2 text-secondary placeholder:text-right focus:outline-none p-10
              ${passwordError ? "border-reject" : "border-accept"} focus:border-primary`}
            required
          />
          {passwordTouched &&
            Object.values(passwordErrors).map((error, index) => (
              <p
                key={index}
                className={`mt-1 mr-4 text-right text-xs ${
                  error.isError ? "text-reject" : "text-accept"
                }`}
              >
                {error.message}
              </p>
            ))}
        </div>
        <div className="mb-4">
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            dir="rtl"
            onFocus={() => setConfirmPasswordTouched(true)}
            onBlur={() => setConfirmPasswordTouched(false)}
            placeholder="تکرار رمز عبور جدید"
            className={`mt-6 w-full rounded-md border-[3px] bg-white px-4 py-2 text-secondary placeholder:text-right focus:outline-none p-10
              ${confirmPasswordError ? "border-reject" : "border-accept"} focus:border-primary`}
            required
          />
          {confirmPasswordTouched && (
            <p
              className={`mt-1 mr-4 text-right text-xs ${
                confirmPasswordError ? "text-reject" : "text-accept"
              }`}
            >
              {confirmPasswordError
                ? "رمز عبور و تکرار آن مطابقت ندارند"
                : "رمز عبور و تکرار آن مطابقت دارند"}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={passwordError || confirmPasswordError}
          className={`mt-6 w-full rounded-md px-4 py-2 text-white transition duration-300  ${
            !passwordError && !confirmPasswordError ? "bg-primary" : "bg-muted"
          }`}
        >
          تایید
        </button>
      </form>
    </div>
  );
};

ResetPassword.propTypes = {
  handleChangePassword: PropTypes.func.isRequired,
};

export default ResetPassword;
