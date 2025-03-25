import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import EmailInput from "../components/EmailInput";
import VerificationCode from "../components/VerificationCode";
import PasswordLogin from "../components/PasswordLogin";
import routes from "../routes/Routes";
import { useLoginStep, useEmail } from "../stores/login";
import { toast } from "react-toastify";
import { usePostRequest } from "../services/api"; // Import the usePostRequest hook from your API configuration

const Login = () => {
  const { step, setStep } = useLoginStep();
  const { email, setEmail } = useEmail(); // Ensure email is accessible
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  // Use the usePostRequest hook for email submission
  const { mutate: submitEmail, isLoading: isSubmitting } = usePostRequest();

  const handleEmailSubmit = (email) => {
    setEmail(email); // Save the email in the store

    // Use the submitEmail mutation to post the email
    submitEmail(
      { url: "/auth/send-otp", data: { email } },
      {
        onSuccess: (data) => {
          // console.log("API Response Data:", data);
          setUserExists(data.exists);
          setStep("verification"); // Move to the next step
          toast.success("کد ورود به ایمیل شما ارسال شد.");
        },
        onError: (error) => {
          console.error("Error checking email:", error);
          // toast.error("Error checking email. Please try again.");
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      }
    );
  };

  const { mutate: submitOTP, isLoading: isSubmittingOTP } = usePostRequest();

  const handleVerificationSuccess = (otp) => {
    console.log("Submitting OTP:", { email, otp }); // Debugging

    submitOTP(
      { url: "/auth/login/otp", data: { email : email, otp: otp } },
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

          // // localStorage.setItem("test", Cookies.get('.Tunnels.Relay.WebForwarding.Cookies'));
          // localStorage.setItem("jwtToken", localStorage.get('jwtToken'));
          // console.log("jwt : ", localStorage.get('jwtToken'));
          // // console.log("test Token : ", Cookies.get('.Tunnels.Relay.WebForwarding.Cookies'));
          // console.log("proccess ended");
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
          // alert("Error checking OTP. Please try again.");
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            console.log("cuse : " , error.cause);
            console.log("error : " , error);
            toast.error("مشکلی رخ داده است. دوباره تلاش کنید.");
          }
        },
      }
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
          <EmailInput handleEmailSubmit={handleEmailSubmit} isLoading={isSubmitting} />
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