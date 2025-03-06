import  { useState } from 'react';
import ResetPassword from '../components/ResetPassword'; 

const ForgetPassword = () => {

  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // مراحل: 'email', 'ResetPassword'

  const handleEmailSubmit = (email) => {
    setEmail(email);
    setStep('ResetPassword'); // به مرحله تغییر رمز عبور بروید
  };

  const handleResetPasswordSuccess = () => {
    // تغیی رمز اوکی بوده
    // کارای لازمو انجام بدیم
    // مثلا ست کردن توکن و ...    
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
      {step === 'ResetPassword' && (
        <ResetPassword
          handleResetPasswordSuccess={handleResetPasswordSuccess}
        />
      )}
    </div>
  );
};

export default ForgetPassword;