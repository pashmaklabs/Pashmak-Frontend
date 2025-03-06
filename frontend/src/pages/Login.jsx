import { useState } from 'react';
import EmailInput from '../components/EmailInput';
import VerificationCode from '../components/VerificationCode';
import PasswordLogin from '../components/PasswordLogin';

const Login = () => {
    //Steps: 'Email', 'Verification', 'Password'
    const [step, setStep] = useState ('email')
    const [email, setEmail] = useState('');
    const [userExists, setUserExists] = useState(false);

    const handleEmailSubmit = (email) => {
        // اینجا باید ای پی ای بک کال کنیم ببینیم ثبت نام شده یا نه
        // البته اگه بک ارور دیگه ای نده موارد زیر ست میشه
      const userExists = true; // نتیجه رو اینجا باید بزاریم
      setUserExists(userExists);
      setEmail(email);
      setStep('verification');
    };
    
    const handleLoginPasswordRedirect = () => {
        setStep('password');
    }

    const handleVerificationSuccess = () => {
      if (userExists) {
        // تایید با ایمیل انجام شده برای ورود موارد لازم 
      } else {
        // ثبتنام تایید شده
      }
    };
    
    const handlePasswordLoginSuccess = () => {
      // ورود با رمز اوکی بوده کارای لازم انجام بشه
    };
  
    return (
      <div>
        {step === 'email' && <EmailInput handleEmailSubmit={handleEmailSubmit} />}
        {step === 'verification' && (
          <VerificationCode
            email={email}
            handleLoginPasswordRedirect={handleLoginPasswordRedirect}
            handleVerificationSuccess={handleVerificationSuccess}
            showPasswordLoginButton={userExists}
          />
        )}
        {step === 'password' && <PasswordLogin  handlePasswordLoginSuccess={handlePasswordLoginSuccess} />}
      </div>
    );
  };
  
  export default Login;