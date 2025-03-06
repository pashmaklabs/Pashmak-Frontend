import { useState } from 'react';
import EmailInput from '../components/EmailInput';
import VerificationCode from '../components/VerificationCode';
import SignUp from '../components/SignUp';
import PasswordLogin from '../components/PasswordLogin';
import useStore from '../store/store';

const Login = () => {
    //Steps: 'Email', 'Verification', 'Signup', 'Password'
    const [step, setStep] = UseState ('email');
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
        setStep('signup');
      }
    };
  
    const handleSignUpSuccess = () => {
      // ثبت نام اوکی بوده کارای لازمو انجام بدیم
      // مثلا ست کردن توکن و ...
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
        {step === 'signup' && <SignUp email={email} handleSignUpSuccess={handleSignUpSuccess} />}
        {step === 'password' && <PasswordLogin  handlePasswordLoginSuccess={handlePasswordLoginSuccess} />}
      </div>
    );
  };
  
  export default Login;