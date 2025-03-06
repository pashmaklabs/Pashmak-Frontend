import  { useState } from 'react';
import PropTypes from 'prop-types';

const VerificationCode = ({ email, handleLoginPasswordRedirect, handleVerificationSuccess, showPasswordLoginButton }) => {
    const [code, setCode] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // از ای پی ای بک استفاده کنیم برای ورود ببین تایید کرده یا نه
      const isValid = true; // نتیجش بزاریم اینجا
      if (isValid) {
        handleVerificationSuccess();
      }
    };
  
    return (
      <div>
        <p>A verification code has been sent to {email}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            required
          />
          <button type="submit">Verify</button>
        </form>
        {showPasswordLoginButton && (
          <button onClick={handleLoginPasswordRedirect}>Login with Password</button>
        )}
      </div>
    );
  };

  VerificationCode.propTypes = {
    handleLoginPasswordRedirect: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    handleVerificationSuccess: PropTypes.func.isRequired,
    showPasswordLoginButton: PropTypes.bool.isRequired,
  };
  
  export default VerificationCode;