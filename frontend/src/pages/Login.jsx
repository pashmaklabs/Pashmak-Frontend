import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import EmailInput from "../components/EmailInput";
import VerificationCode from "../components/VerificationCode";
import PasswordLogin from "../components/PasswordLogin";
import routes from "../routes/Routes";
import { useLoginStep, useEmail } from "../stores/login";
import { toast } from "react-toastify";
import { usePostRequest } from "../services/api";

const Login = () => {
  const { step, setStep } = useLoginStep();
  const { email, setEmail } = useEmail();
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  const { mutate: submitEmail, isLoading: isSubmitting } = usePostRequest();

  const handleEmailSubmit = (email) => {
    if (email !== "") {
      setEmail(email);
    }

    submitEmail(
      { url: "/auth/send-otp", data: { email } },
      {
        onSuccess: (data) => {
          setUserExists(data.exists);
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
    console.log("Submitting OTP:", { email, otp });

    submitOTP(
      { url: "/auth/login/otp", data: { email: email, otp: otp } },
      {
        onSuccess: (response) => {
          console.log("proccess running ...");

          const authHeader = response.headers["Authorization"];
          if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            localStorage.setItem("jwtToken", token);
            console.log("JWT Token:", token);
          } else {
            console.error("Authorization header missing or invalid");
          }

          console.log(response);
          console.log(response.headers);

          if (userExists) {
            navigate(routes.home);
            toast.success("خوش آمدید.");
          } else {
            navigate(routes.completeProfile);
            toast.success("ورود موفقیت آمیز بود. پروفایل خود را تکمیل کنید.");
          }
        },
        onError: (error) => {
          console.error("Error checking OTP:", error);

          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            console.log("cuse : ", error.cause);
            console.log("error : ", error);
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      },
    );
  };

  const handlePasswordLoginSuccess = () => {
    navigate(routes.home);
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <PageTransition key={step}>
        {step === "email" && (
          <EmailInput
            handleEmailSubmit={handleEmailSubmit}
            isLoading={isSubmitting}
          />
        )}
        {step === "verification" && (
          <VerificationCode
            handleEmailSubmit={handleEmailSubmit}
            handleVerificationSuccess={handleVerificationSuccess}
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
      </PageTransition>
    </div>
  );
};

export default Login;
