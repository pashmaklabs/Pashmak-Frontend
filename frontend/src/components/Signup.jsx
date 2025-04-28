import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import routes from "../routes/Routes";

const Signup = ({ handleSignup }) => {
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(true);
  const [confirmPasswordError, setConfirmPasswordError] = useState(true);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup(firstname, lastname, password);
  };

  useEffect(() => {
    validatePassword(password);
  }, []);

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
    setConfirmPasswordError(inputConfirmPassword !== password);
  };

  const handleNameChange = (e, setter) => {
    const value = e.target.value;
    if (/^[\u0600-\u06FFa-zA-Z\s]*$/.test(value)) {
      setter(value);
    }
  };

  useEffect(() => {
    setConfirmPasswordError(confirmPassword !== password);
  }, [password, confirmPassword]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      className="pb-12 w-full max-w-[474px] rounded-lg bg-white p-6 shadow-lg lg:p-8 mx-auto my-8"
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center">
          <img src="/logo.svg" alt="Logo" className="w-10 h-auto" />
          <span className="mt-1 text-center font-Vazir text-sm w-10 text-primary">
            پشمک
          </span>
        </div>
      </div>
      <h2 className="mt-4 mb-4 pb-8 pr-6 text-right font-Vazir text-5xl text-black">
        ثبت نام
      </h2>

      <div className="w-full flex flex-col items-center space-y-4">
        <div className="w-[70%] relative">
          <input
            type="text"
            value={firstname}
            onChange={(e) => handleNameChange(e, setFirstname)}
            dir="rtl"
            placeholder="نام"
            className="w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 text-secondary placeholder:text-right focus:outline-none focus:border-primary"
          />
        </div>
        <div className="w-[70%] relative">
          <input
            type="text"
            value={lastname}
            onChange={(e) => handleNameChange(e, setLastname)}
            dir="rtl"
            placeholder="نام خانوادگی"
            className="w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 text-secondary placeholder:text-right focus:outline-none focus:border-primary"
          />
        </div>

        <div className="w-[70%] relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            dir="rtl"
            onFocus={() => setPasswordTouched(true)}
            onBlur={() => setPasswordTouched(false)}
            placeholder="رمز عبور جدید را وارد کنید"
            className={`w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 text-secondary placeholder:text-right focus:outline-none ${
              password === ""
                ? "border-stone-300"
                : passwordError
                  ? "border-reject"
                  : "border-accept"
            } focus:border-primary`}
          />
          <div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5 text-primary" />
            ) : (
              <EyeIcon className="w-5 h-5 text-primary" />
            )}
          </div>
        </div>

        <div className="w-[70%] relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            dir="rtl"
            onFocus={() => setConfirmPasswordTouched(true)}
            onBlur={() => setConfirmPasswordTouched(false)}
            placeholder="تکرار رمز عبور جدید"
            className={`mb-1 w-full rounded-md border-[1px] bg-white px-3 py-2 sm:px-4 sm:py-2 text-secondary placeholder:text-right focus:outline-none ${
              confirmPassword === ""
                ? "border-stone-300"
                : confirmPasswordError
                  ? "border-reject"
                  : "border-accept"
            } focus:border-primary`}
            required={!!password}
          />
          <div
            className="absolute left-3 top-5 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? (
              <EyeOffIcon className="w-5 h-5 text-primary" />
            ) : (
              <EyeIcon className="w-5 h-5 text-primary" />
            )}
          </div>

          {Object.values(passwordErrors).map((error, index) => (
            <p
              key={index}
              className={`mt-1 mr-2 sm:mr-4 text-right text-xs ${
                error.isError ? "text-reject" : "text-accept"
              }`}
            >
              {error.message}
            </p>
          ))}

          <p
            className={`mt-1 mr-2 sm:mr-4 text-right text-xs ${
              confirmPasswordError ? "text-reject" : "text-accept"
            }`}
          >
            {confirmPasswordError
              ? "رمز عبور و تکرار آن مطابقت ندارند"
              : "رمز عبور و تکرار آن مطابقت دارند"}
          </p>
        </div>

        <div className="flex gap-3 mt-6 w-[70%] mx-auto">
          <button
            onClick={() => {
              navigate(routes.map);
            }}
            className="w-[42.85%] py-2 rounded-md text-gray-700 bg-gray-400 text-sm sm:text-base border-zinc-700 border-[1px]"
          >
            بعدا
          </button>
          <button
            type="submit"
            disabled={
              ((passwordError || confirmPasswordError) &&
                (password !== "" || confirmPassword !== "")) ||
              (!firstname && !lastname && !password)
            }
            className={`w-full py-2 rounded-md text-white transition duration-300 text-sm sm:text-base ${
              ((passwordError || confirmPasswordError) &&
                (password !== "" || confirmPassword !== "")) ||
              (!firstname && !lastname && !password)
                ? "bg-slate-400"
                : "bg-primary"
            }`}
          >
            تایید
          </button>
        </div>
      </div>
    </form>
  );
};

Signup.propTypes = {
  handleSignup: PropTypes.func.isRequired,
};

export default Signup;
