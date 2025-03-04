import  { useState } from 'react';
import PropTypes from 'prop-types';

const SignUp = ({ email, handleSignUpSuccess }) => {
  const [userData, setUserData] = useState({
    name: '',
    password: '',
    confirm_password:'',
    email: email
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    //باید چک کنیم ثبت نام موفق بوده یا نه
    handleSignUpSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        placeholder="Enter your name"
        required
      />
      <input
        type="password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        placeholder="Enter your password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

SignUp.propTypes = {
  email: PropTypes.string.isRequired, 
  handleSignUpSuccess: PropTypes.func.isRequired, 
};

export default SignUp;