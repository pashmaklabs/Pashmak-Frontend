import { useState } from "react";
import PropTypes from "prop-types";
import { useEmail, useLoginStep } from "../stores/login";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";

const EmailInput = ({ handleEmailSubmit, isLoading }) => {
  const { email, setEmail } = useEmail();
  const [isValidEmail, setIsValidEmail] = useState(false);
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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValidEmail(emailRegex.test(inputEmail));
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="relative w-full h-full rounded-[24px] bg-white p-8 shadow-lg lg:h-[584px] lg:w-[474px]"
      >
        <div className="absolute right-4 top-4 cursor-pointer">
          <img
            src="/closeWhiteBg.svg"
            alt="close"
            className="w-8 h-auto"
            onClick={() => navigate(-1)}
          />
        </div>

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
  enteredEmail: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
};
export default EmailInput;
