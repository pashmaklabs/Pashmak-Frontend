import { useState, useEffect } from "react";
import PageTransition from "../components/PageTransition";
import VerificationCode from "../components/VerificationCode";
import ResetPassword from "../components/ResetPassword";
import { useNavigate } from "react-router-dom";
import routes from "../routes/Routes";
import { useLoginStep, useEmail } from "../stores/login";

const ForgetPassword = () => {
  const [stepPassword, setStepPassword] = useState("verification");
  const navigate = useNavigate();
  const { email } = useEmail();
  const { setStep } = useLoginStep();

  useEffect(() => {
    if (!email) {
      navigate(routes.login);
    }
  }, [email, navigate]);

  const handleVerificationSuccess = () => {
    // Set token
    // Show in the Case of Error
    setStepPassword("ResetPassword");
  };

  const handleChangePassword = () => {
    // Patch a password to change the password from the back side
    navigate(routes.map);
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center"
      style={{  backgroundImage: "linear-gradient(120deg, #5E2B7A, #85A4E2, #C77DF3)" }}
    >
      <PageTransition key={stepPassword}>
        {stepPassword === "verification" && (
          <VerificationCode
            email={email}
            handleVerificationSuccess={handleVerificationSuccess}
            setStep={setStep}
            userExists={true}
          />
        )}
        {stepPassword === "ResetPassword" && (
          <ResetPassword handleChangePassword={handleChangePassword} />
        )}
      </PageTransition>
    </div>
  );
};

export default ForgetPassword;
