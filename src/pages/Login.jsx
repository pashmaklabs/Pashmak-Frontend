import { useState, memo } from "react";
import { data, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import EmailInput from "../components/EmailInput";
import VerificationCode from "../components/VerificationCode";
import PasswordLogin from "../components/PasswordLogin";
import Signup from "../components/Signup";
import routes from "../routes/Routes";
import {
  useLoginStep,
  useEmail,
  useUserLogin,
  useRole,
  useLoginStartPath,
} from "../stores/login";
import { toast } from "react-toastify";
import { usePostRequest, usePatchRequest } from "../services/api";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";

const Login = () => {
  const { step, setStep } = useLoginStep();
  const { email, setEmail } = useEmail();
  const { role, setRole } = useRole();
  const { userLogin, setUserLogin } = useUserLogin();
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();
  const { loginStartPath } = useLoginStartPath();

  const { mutate: submitEmail, isLoading: isSubmitting } = usePostRequest();

  const handleEmailSubmit = (email) => {
    // --- تغییر جدید برای ارکپچا ---
    const captchaToken = window.arcaptcha?.getArcToken();
    
    if (!captchaToken && step === "email") {
     toast.error("لطفاً تیک کپچا را بزنید");
    return;
    }
    // ----------------------------

    if (email !== "") {
      setEmail(email);
    }
    submitEmail(
      { 
        url: "/auth/otp/send", 
        data: { 
          email,
          "arcaptcha-token": captchaToken // ارسال توکن به بک‌اِند
        } 
      },
      {
        onSuccess: (data) => {
          setUserExists(data.userExists);
          setStep("verification");
          toast.success("کد ورود به ایمیل شما ارسال شد.");
        },
        onError: (error) => {
          console.error("Error checking email:", error);
          // اگر کپچا اشتباه باشد، ویجت را ریست می‌کنیم
          window.arcaptcha?.reset();
          
          // اگر کپچا اشتباه باشد، ویجت را ریست می‌کنیم
          window.arcaptcha?.reset();
          
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  const handleCloseLoginFlow = () => {
    setStep("email");
    setEmail("");
    setUserExists(false);
    navigate(loginStartPath);
  };

  const handleCloseSignUp = () => {
    setStep("email");
    navigate(loginStartPath);
  };

  const { mutate: submitOTP, isLoading: isSubmittingOTP } = usePostRequest();

  const handleVerificationSuccess = (otp) => {
    submitOTP(
      { url: "/auth/otp/verify", data: { email: email, otp: otp } },
      {
        onSuccess: (response) => {
          const roleFromServer = response?.role;
          setUserLogin(true);
          setRole(roleFromServer);
          Cookies.set("role", roleFromServer);
          if (userExists) {
            toast.success("خوش آمدید.");
            if (roleFromServer === "admin") {
              navigate(routes.admin);
            } else {
              navigate(routes.map);
            }
          } else {
            toast.success("خوش آمدید. میتوانید پروفایل خود را تکمیل کنید.");
            setStep("signup");
            toast.success("ورود موفقیت آمیز بود. پروفایل خود را تکمیل کنید.");
          }
        },
        onError: (error) => {
          console.error("Error checking OTP:", error);

          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("ورود موفقیت آمیز نبود. دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  const { mutate: submitInfo, isLoading: isSubmittingInfo } = usePatchRequest();

  const handleSignup = (firstname, lastname, password) => {
    submitInfo(
      {
        url: "/auth/signup",
        data: {
          firstname: firstname,
          lastname: lastname,
          password: password,
          passwordConfirm: password,
        },
      },
      {
        onSuccess: (data) => {
          setUserExists(true);
          toast.success("تغییرات حساب کاربری شما با موفقیت اعمال شد✅");
          navigate(routes.map);
        },
        onError: (error) => {
          console.error("خطا در تکمیل حساب کاربری:", error);
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  const { mutate: submitPassword, isLoading: isSubmittingPassword } =
    usePostRequest();

  const handlePasswordLoginSuccess = (password) => {
    submitPassword(
      { url: "/auth/password", data: { email: email, password: password } },
      {
        onSuccess: (data) => {
          setUserLogin(true);
          setUserExists(true);
          const roleFromServer = data?.role;
          setRole(roleFromServer);
          Cookies.set("role", roleFromServer);
          toast.success("با موفقیت وارد شدید.");
          if (roleFromServer === "admin") {
            navigate(routes.admin);
          } else {
            navigate(routes.map);
          }
        },
        onError: (error) => {
          console.error("خطا در ورود با رمز:", error);
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  return (
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-purple-50 bg-opacity-40 backdrop-blur-sm">
      <Helmet>
        <title>ورود</title>
      </Helmet>

      <PageTransition key={step}>
        {step === "email" && (
          <div className="flex flex-col gap-4">
            <EmailInput
              handleEmailSubmit={handleEmailSubmit}
              isLoading={isSubmitting}
              handleCloseLoginFlow={handleCloseLoginFlow}
            />

          </div>
          <div className="flex flex-col gap-4">
            <EmailInput
              handleEmailSubmit={handleEmailSubmit}
              isLoading={isSubmitting}
              handleCloseLoginFlow={handleCloseLoginFlow}
            />

          </div>
        )}
        {step === "verification" && (
          <VerificationCode
            handleVerificationSuccess={handleVerificationSuccess}
            handleEmailSubmit={handleEmailSubmit}
            userExists={userExists}
            isLoading={isSubmittingOTP}
            handleCloseLoginFlow={handleCloseLoginFlow}
          />
        )}
        {step === "password" && (
          <PasswordLogin
            handlePasswordLoginSuccess={handlePasswordLoginSuccess}
            setUserExists={setUserExists}
            isLoading={isSubmittingPassword}
            handleCloseLoginFlow={handleCloseLoginFlow}
            handleEmailSubmit={handleEmailSubmit}
          />
        )}
        {step === "signup" && (
          <Signup
            handleSignup={handleSignup}
            isLoading={isSubmittingInfo}
            handleCloseSignUp={handleCloseSignUp}
          />
        )}
      </PageTransition>
    </div>
  );
};

export default memo(Login);
