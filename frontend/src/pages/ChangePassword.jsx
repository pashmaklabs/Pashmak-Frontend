import  { useState } from 'react';
import SetPassword from '../components/SetPassword'; 
import { useLocation } from 'react-router-dom';
const ForgetPassword = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isFromLogin = searchParams.get('ForgetPassword') === 'true'; // اگه با  فراموشی رمز در صورت تغییر بره به مرحله وارد کردن رمز
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // مراحل: 'email', 'SetPassword'

  const handleEmailSubmit = (email) => {
    setEmail(email);
    setStep('SetPassword'); // به مرحله تغییر رمز عبور بروید
  };

  const handleSetPasswordSuccess = () => {
    // پس از تغییر رمز عبور، کاربر را به صفحه ورود هدایت کنید
    // history.push('/login');
  };

  return (
    <div>
      {step === 'email' && (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleEmailSubmit(email);
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {step === 'SetPassword' && (
        <SetPassword
          handleSetPasswordSuccess={handleSetPasswordSuccess}
          isFromForgetPassword={isFromLogin} // مشخص کنید که کاربر از صفحه فراموشی رمز عبور آمده است
        />
      )}
    </div>
  );
};

export default ForgetPassword;