import  { useState } from 'react';
import PropTypes from 'prop-types';

const EmailInput = ({ handleEmailSubmit }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEmailSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit">Next</button>
    </form>
  );
};
EmailInput.propTypes = {
    handleEmailSubmit: PropTypes.func.isRequired,
  };
export default EmailInput;