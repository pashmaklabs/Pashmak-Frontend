import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import EmailInput from "../components/EmailInput";
import VerificationCode from "../components/VerificationCode";
import PasswordLogin from "../components/PasswordLogin";
import routes from "../routes/Routes";
import { useLoginStep, useEmail } from "../stores/login";
import { usePostRequest } from "../services/api"; // Import the usePostRequest hook from your API configuration

const Login = () => {
  const { step, setStep } = useLoginStep();
  const { setEmail } = useEmail();
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  // Use the usePostRequest hook for email submission
  const { mutate: submitEmail, isLoading } = usePostRequest();

  const handleEmailSubmit = (email) => {
    setEmail(email); // Save the email in the store

    // Use the submitEmail mutation to post the email
    submitEmail(
      { url: "/send-otp", data: { email } },
      {
        onSuccess: (data) => {
          // Assuming the API returns { exists: true/false }
          setUserExists(data.exists);
          setStep("verification"); // Move to the next step
        },
        onError: (error) => {
          console.error("Error checking email:", error);
          alert("Error checking email. Please try again.");
        },
      }
    );
  };

  const handleVerificationSuccess = () => {
    // In both login and registration modes should set token and operations required
    if (userExists) {
      navigate(routes.home);
    } else {
      navigate(routes.completeProfile);
    }
  };

  const handlePasswordLoginSuccess = () => {
    // Perform the operations required for entry
    navigate(routes.home);
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <PageTransition key={step}>
        {step === "email" && (
          <EmailInput handleEmailSubmit={handleEmailSubmit} isLoading={isLoading} />
        )}
        {step === "verification" && (
          <VerificationCode
            handleVerificationSuccess={handleVerificationSuccess}
            userExists={userExists}
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