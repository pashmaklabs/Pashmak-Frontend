import { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const EmailInput = ({ handleEmailSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidEmail) {
      handleEmailSubmit(email);
    }
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValidEmail(emailRegex.test(inputEmail));
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full rounded-[24px] bg-white p-8 shadow-lg lg:h-[584px] lg:w-[474px]"
      >
        <div className="mt-6 mb-4 flex flex-col items-center justify-center">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-[50%] w-[50%] lg:h-[88px] lg:w-[132px]"
          />
          <p className="mt-1 text-center font-Vazir text-3xl text-primary">
            پشمک
          </p>
        </div>
        <h2 className="mt-12 mb-2 text-right font-Vazir text-5xl text-primary">
          ورود
        </h2>
        <p className="mb-6 text-right font-Vazir text-3xl text-muted">
          ...سفرتو شروع کن
        </p>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            dir="rtl"
            placeholder="ایمیل خود را وارد کنید"
            // یا کلا خاکستری باشه و آبی بشه با focus یا یا اینکه با درست غلط بودنش سبز و قرمز شه
            className={`mt-6 w-full rounded-md border-[2px] bg-white px-4 py-2 text-secondary placeholder:text-right focus:outline-none p-10
              ${
                email === ""
                  ? "border-stone-300"
                  : isValidEmail
                    ? "border-accept"
                    : "border-reject"
              } focus:border-primary`}
            required
          />
          {!isValidEmail && email.length > 0 && (
            <p className="mt-1 mr-4 text-right text-xs text-reject">
              لطفا یک ایمیل معتبر وارد کنید
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValidEmail || isLoading}
          className={`mt-6 w-full rounded-md px-4 py-2 text-white transition duration-300 ${
            isValidEmail ? "bg-primary" : "bg-muted"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                className="mr-2"
              />
              Loading...
            </div>
          ) : (
            "ورود"
          )}
        </button>
      </form>
    </div>
  );
};

EmailInput.propTypes = {
  handleEmailSubmit: PropTypes.func.isRequired,
};
export default EmailInput;
