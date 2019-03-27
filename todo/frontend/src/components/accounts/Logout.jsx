/* eslint-env browser */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
import React from 'react';
import PropTypes from 'prop-types';

function Logout(props) {
  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  };

  const onClick = (e) => {
    props.setSignIn(false);
    logout();
  };

  return (
    <button type="button" className="btn btn-secondary" onClick={onClick}>
      Logout
    </button>
  );
}

Logout.propTypes = {
  setSignIn: PropTypes.func.isRequired,
};

export default Logout;
