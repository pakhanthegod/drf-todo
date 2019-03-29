/* eslint-env browser */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
import React from 'react';
import { NavLink } from 'react-router-dom';
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
    <NavLink to="/" className="nav-link" onClick={onClick}>
      Logout
    </NavLink>
  );
}

Logout.propTypes = {
  setSignIn: PropTypes.func.isRequired,
};

export default Logout;
