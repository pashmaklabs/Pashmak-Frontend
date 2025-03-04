import  { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store'; 

const SetPassword = ({ handleSetPasswordSuccess, isFromForgetPassword = false }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); 
  const { setStep } = useStore()
  const handleSubmit = (e) => {
    e.preventDefault();
    // ارسال رمز به بک
    const isSuccess = true; // جواب بک
    if (isSuccess) {
      if (isFromForgetPassword) { // رفتن به صفحه لاگین در مرحله وارد کردن رمز اگر از فراموشی رمز اومده بود
        setStep('password'); 
        navigate('/login'); 
      } else {
        handleSetPasswordSuccess(); 
      }
    }
  };

  return (
    <div>
      <h2>Set Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        <button type="submit">Set Password</button>
      </form>
    </div>
  );
};

SetPassword.propTypes = {
  handleSetPasswordSuccess: PropTypes.func.isRequired,
  isFromForgetPassword: PropTypes.bool, 
};

export default SetPassword;