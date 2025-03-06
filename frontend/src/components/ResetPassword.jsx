import  { useState } from 'react';
import PropTypes from 'prop-types';

const ResetPassword = ({ handleResetPasswordSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // validation انجام میشه
    // ارسال رمز به بک
    const isSuccess = true; // جواب بک
    if (isSuccess) {
      handleResetPasswordSuccess(); 
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

ResetPassword.propTypes = {
  handleResetPasswordSuccess: PropTypes.func.isRequired,
  isFromForgetPassword: PropTypes.bool, 
};

export default ResetPassword;