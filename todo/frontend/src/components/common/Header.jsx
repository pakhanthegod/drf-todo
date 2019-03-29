/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* eslint consistent-return: "error" */

import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import Logout from '../accounts/Logout';

function Header(props) {
  const { signIn } = props;
  const renderNav = () => {
    if (signIn) {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Logout {...props} />
          </li>
        </ul>
      );
    }
    return (
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName="active" to="/login">
            Login
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName="active" to="/register">
            Register
          </NavLink>
        </li>
      </ul>
    );
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <li className="navbar-brand">
        <NavLink className="nav-link" to="/">
          Todo
        </NavLink>
      </li>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        {renderNav()}
      </div>
    </nav>
  );
}

Header.propTypes = {
  signIn: PropTypes.bool.isRequired,
};

export default Header;
