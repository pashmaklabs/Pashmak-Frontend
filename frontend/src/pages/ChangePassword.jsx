import { useState, useEffect, useCallback, memo } from "react";
import PageTransition from "../components/PageTransition";
import VerificationCode from "../components/VerificationCode";
import ResetPassword from "../components/ResetPassword";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import { toast } from "react-toastify";
import { useUserLogin, useEmail } from "../stores/login";

import { usePostRequest } from "../services/api";

const ChangePassword = () => {
  const [step, setStep] = useState("verification");
  const navigate = useNavigate();
  const { email, setEmail } = useEmail();
  const { userLogin, setUserLogin } = useUserLogin();

  useEffect(() => {
    console.log(userLogin);
    if (userLogin) {
      setStep("ResetPassword");
    } else if (!email) {
      navigate(routes.login);
    }
  }, [userLogin, email]);

  const { mutate: submitOTP, isLoading: isSubmittingOTP } = usePostRequest();

  const handleVerificationSuccess = useCallback(
    (otp) => {
      console.log("Submitting OTP in change password:", { email, otp });

      submitOTP(
        {
          url: "/auth/password/forget/verify",
          data: { email: email, otp: otp },
        },
        {
          onSuccess: () => {
            setStep("ResetPassword");
            toast.success("ایمیل ما تایید شد. میتوانید رمز خود را تغییر دهید.");
          },
          onError: (error) => {
            console.error("Error checking OTP:", error);

            if (error.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              console.log("cause : ", error.cause);
              console.log("error : ", error);
              toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
            }
          },
        },
      );
    },
    [email, setStep, submitOTP],
  );

  const { mutate: submitPassword, isLoading: isSubmittingPassword } =
    usePostRequest();

  const handleChangePassword = (password) => {
    // Patch a password to change the password from the back side
    submitPassword(
      {
        url: "/auth/password/forget/reset",
        data: { email: email, password: password },
      },
      {
        onSuccess: (data) => {
          console.log(data);
          toast.success("رمز با موفقیت تغییر کرد.");
          navigate(routes.map);
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

    navigate(routes.home);
  };

  return (
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-black/20 backdrop-blur-sm">
      <PageTransition key={step}>
        {step === "verification" && (
          <VerificationCode
            handleVerificationSuccess={handleVerificationSuccess}
            userExists={true}
            isLoading={isSubmittingOTP}
          />
        )}
        {step === "ResetPassword" && (
          <ResetPassword handleChangePassword={handleChangePassword} />
        )}
      </PageTransition>
    </div>
  );
};

export default memo(ChangePassword);
