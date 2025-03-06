import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const PasswordLogin = ({ handlePasswordLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    // ارسال رمز به بک و تایید
    const isValid = true; // جواب بک
    if (isValid) {
      handlePasswordLoginSuccess();
    }
  };

  const handleForgetPasswordClick = () => {
    navigate('/change-password'); // رفتن به صفحه تغییر رمز
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleForgetPasswordClick}>Forgot Password?</button>
    </div>
    // Add a button to 'verification with code' step
  );
};

PasswordLogin.propTypes = {
    setLoginStep :  PropTypes.func.isRequired,
    handlePasswordLoginSuccess: PropTypes.func.isRequired,
};

export default PasswordLogin;