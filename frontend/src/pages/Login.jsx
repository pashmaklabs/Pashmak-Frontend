import { useState, memo } from "react";
import { data, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import EmailInput from "../components/EmailInput";
import VerificationCode from "../components/VerificationCode";
import PasswordLogin from "../components/PasswordLogin";
import Signup from "../components/Signup";
import routes from "../routes/Routes";
import { useLoginStep, useEmail, useUserLogin, useRole } from "../stores/login";
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

  const { mutate: submitEmail, isLoading: isSubmitting } = usePostRequest();

  const handleEmailSubmit = (email) => {
    if (email !== "") {
      setEmail(email);
    }
    submitEmail(
      { url: "/auth/otp/send", data: { email } },
      {
        onSuccess: (data) => {
          setUserExists(data.userExists);
          setStep("verification");
          toast.success("کد ورود به ایمیل شما ارسال شد.");
        },
        onError: (error) => {
          console.error("Error checking email:", error);
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  const { mutate: submitOTP, isLoading: isSubmittingOTP } = usePostRequest();

  const handleVerificationSuccess = (otp) => {
    submitOTP(
      { url: "/auth/otp/verify", data: { email: email, otp: otp } },
      {
        onSuccess: (response) => {
          const roleFromServer = response?.role;
          if (userExists) {
            setUserLogin(true);
            setRole(roleFromServer);
            Cookies.set("role", roleFromServer);
            toast.success("خوش آمدید.");
            if (roleFromServer === "admin") {
              navigate(routes.admin);
            } else {
              navigate(routes.map);
            }
          } else {
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
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-black/20 backdrop-blur-sm">
      <Helmet>
        <title>ورود</title>
      </Helmet>

      <PageTransition key={step}>
        {step === "email" && (
          <EmailInput
            handleEmailSubmit={handleEmailSubmit}
            isLoading={isSubmitting}
          />
        )}
        {step === "verification" && (
          <VerificationCode
            handleVerificationSuccess={handleVerificationSuccess}
            handleEmailSubmit={handleEmailSubmit}
            userExists={userExists}
            isLoading={isSubmittingOTP}
          />
        )}
        {step === "password" && (
          <PasswordLogin
            handlePasswordLoginSuccess={handlePasswordLoginSuccess}
            setUserExists={setUserExists}
          />
        )}
        {step === "signup" && <Signup handleSignup={handleSignup} />}
      </PageTransition>
    </div>
  );
};

export default memo(Login);
